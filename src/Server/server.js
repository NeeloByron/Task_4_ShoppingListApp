import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');

const app = express();
app.use(express.json());

// Enable loose development CORS connectivity mapping
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const JWT_SECRET = 'SUPER_SECRET_SIGNING_KEY_XYZ_123';

// Direct file access helpers
const getDatabase = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const saveDatabase = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

const generateToken = (payload) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const stringifiedPayload = btoa(JSON.stringify({ ...payload, exp: Date.now() + 3600000 }));
  const signature = CryptoJS.HmacSHA256(`${header}.${stringifiedPayload}`, JWT_SECRET).toString();
  return `${header}.${stringifiedPayload}.${signature}`;
};

// Endpoint 1: Auth Registration Pipeline [/register]
app.post('/register', async (req, res) => {
  const { name, surname, email, cellNumber, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields.' });

  const db = getDatabase();
  if (db.users?.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ message: 'Email already registered.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: String(db.users?.length ? Math.max(...db.users.map(u => Number(u.id))) + 1 : 1),
      name, surname, email, cellNumber: Number(cellNumber),
      password: hashedPassword, createdAt: new Date().toISOString()
    };

    if (!db.users) db.users = [];
    db.users.push(newUser);
    saveDatabase(db);

    const { password: _, ...sanitized } = newUser;
    const token = generateToken({ id: sanitized.id, email: sanitized.email });
    res.status(201).json({ user: sanitized, token });
  } catch {
    res.status(500).json({ message: 'Server crypt error.' });
  }
});

// Endpoint 2: Auth Login Gate Processing [/login]
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const db = getDatabase();

  const user = db.users?.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid email or password.' });
  }

  const { password: _, ...sanitized } = user;
  const token = generateToken({ id: sanitized.id, email: sanitized.email });
  res.status(200).json({ user: sanitized, token });
});

// Endpoint 3: Public Shared Read-Only Lists Lookups
app.get('/shared/:id', (req, res) => {
  const db = getDatabase();
  const list = db.lists?.find(l => l.id === req.params.id);
  if (!list) return res.status(404).json({ message: 'List not found.' });
  res.json(list);
});

// Token Authorization Handshake Interceptor Guard
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Denied.' });

  try {
    const token = authHeader.split(' ')[1];
    const [header, payload, signature] = token.split('.');
    if (signature !== CryptoJS.HmacSHA256(`${header}.${payload}`, JWT_SECRET).toString()) {
      return res.status(401).json({ message: 'Invalid token signature.' });
    }

    const decoded = JSON.parse(atob(payload));
    if (decoded.exp && Date.now() > decoded.exp) return res.status(401).json({ message: 'Expired.' });

    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: 'Malformed verification token.' });
  }
};

// Protected Shopping List REST CRUD Engine
app.get('/lists', authenticateToken, (req, res) => {
  const db = getDatabase();
  // Filter lists collection records to map exclusively onto authenticated user contexts
  const userLists = db.lists?.filter(l => l.userId === req.userId) || [];
  res.json(userLists);
});

app.post('/lists', authenticateToken, (req, res) => {
  const db = getDatabase();
  const newList = {
    id: String(Date.now()),
    userId: req.userId,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  if (!db.lists) db.lists = [];
  db.lists.push(newList);
  saveDatabase(db);
  res.status(201).json(newList);
});

app.patch('/lists/:id', authenticateToken, (req, res) => {
  const db = getDatabase();
  const listIndex = db.lists?.findIndex(l => l.id === req.params.id && l.userId === req.userId);
  if (listIndex === -1 || listIndex === undefined) return res.status(404).json({ message: 'Not found.' });

  db.lists[listIndex] = { ...db.lists[listIndex], ...req.body };
  saveDatabase(db);
  res.json(db.lists[listIndex]);
});

app.delete('/lists/:id', authenticateToken, (req, res) => {
  const db = getDatabase();
  const filtered = db.lists?.filter(l => !(l.id === req.params.id && l.userId === req.userId));
  db.lists = filtered || [];
  saveDatabase(db);
  res.sendStatus(200);
});

// Production Assets Pipeline Delivery
const distPath = path.join(__dirname, '../../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Fully functional production Express server online over port: ${PORT}`);
});
