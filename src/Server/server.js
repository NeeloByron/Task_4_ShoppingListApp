import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "db.json");

const port = process.env.PORT || "3001";

const jsonServer = spawn(
  "npx",
  [
    "json-server",
    dbPath,
    "--host",
    "0.0.0.0",
    "--port",
    port
  ],
  {
    stdio: "inherit",
    shell: true
  }
);

jsonServer.on("close", (code) => {
  process.exit(code ?? 0);
});