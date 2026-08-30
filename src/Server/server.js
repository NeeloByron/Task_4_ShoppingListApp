import jsonServer from 'json-server';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

const JWT_SECRET = 'SUPER_SECRET_SIGNING_KEY_XYZ_123';

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Database persistence helpers
const getDatabase = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const saveDatabase = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// Generate base64 mock JWT structures
const generateToken = (payload) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const stringifiedPayload = btoa(JSON.stringify({ ...payload, exp: Date.now() + 3600000 }));
  const signature = CryptoJS.HmacSHA256(`${header}.${stringifiedPayload}`, JWT_SECRET).toString();
  return `${header}.${stringifiedPayload}.${signature}`;
};


// Endpoint 1: Secure Account Registration [/register]
server.post('/register', async (req, res) => {
  const { name, surname, email, cellNumber, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password fields are required.' });
  }

  const db = getDatabase();
  const userExists = db.users?.some(u => u.email.toLowerCase() === email.toLowerCase());

  if (userExists) {
    return res.status(400).json({ message: 'This email is already registered.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: String(db.users?.length ? Math.max(...db.users.map(u => Number(u.id))) + 1 : 1),
      name,
      surname,
      email,
      cellNumber: Number(cellNumber),
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    if (!db.users) db.users = [];
    db.users.push(newUser);
    saveDatabase(db);

    const { password: _, ...sanitizedUser } = newUser;
    const token = generateToken({ id: sanitizedUser.id, email: sanitizedUser.email });

    return res.status(201).json({ user: sanitizedUser, token });
  } catch (err) {
    return res.status(500).json({ message: 'Server error encountered during account hashing.' });
  }
});

// Endpoint 2: Cryptographic User Validation [/login]
server.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const db = getDatabase();

  const user = db.users?.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid email or password.' });
  }

  const { password: _, ...sanitizedUser } = user;
  const token = generateToken({ id: sanitizedUser.id, email: sanitizedUser.email });

  return res.status(200).json({ user: sanitizedUser, token });
});

// Middleware 3: Protected Resource Inspector & Interceptor Guard
server.use((req, res, next) => {
  // Allow registration availability scans and shared link hits to pass clean
  if (req.path === '/users' || req.path.startsWith('/shared/')) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. Missing validation token.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const [header, payload, signature] = token.split('.');
    const recomputedSignature = CryptoJS.HmacSHA256(`${header}.${payload}`, JWT_SECRET).toString();

    if (signature !== recomputedSignature) {
      return res.status(401).json({ message: 'Invalid signature verification failed.' });
    }

    const decodedPayload = JSON.parse(atob(payload));
    if (decodedPayload.exp && Date.now() > decodedPayload.exp) {
      return res.status(401).json({ message: 'Authentication lifetime window expired.' });
    }

    req.userId = decodedPayload.id;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Malformed authorization credentials format.' });
  }
});

// Attach the mock database collection path maps for lists collections handling
const router = jsonServer.router(dbPath);
server.use(router);


// Production Configuration: Compiled React File Asset Serving
const distPath = path.join(__dirname, '../../dist');
server.use(express.static(distPath));

server.get('*', (req, res, next) => {
  if (req.path.startsWith('/users') || req.path.startsWith('/lists') || req.path.startsWith('/login') || req.path.startsWith('/register')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// Render implicitly maps dynamically onto available system environment port channels
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Unified API and Web App Dashboard engine running over port: ${PORT}`);
});
