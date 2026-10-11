import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("\x1b[36m%s\x1b[0m", "==================================================");
console.log("\x1b[36m%s\x1b[0m", "      Starting TaskFlow AI Fullstack System       ");
console.log("\x1b[36m%s\x1b[0m", "==================================================");

const nodePath = process.execPath;

// 1. Spawn Backend (Port 5000)
console.log("\x1b[33m%s\x1b[0m", "-> Starting Backend Server (Port 5000)...");
const backend = spawn(nodePath, ["server.js"], {
  cwd: path.join(__dirname, "server"),
  stdio: "pipe",
});

backend.stdout.on("data", (data) => {
  process.stdout.write(`\x1b[34m[Backend]\x1b[0m ${data}`);
});

backend.stderr.on("data", (data) => {
  process.stderr.write(`\x1b[31m[Backend Error]\x1b[0m ${data}`);
});

// 2. Spawn Frontend Vite Dev Server (Port 5173)
console.log("\x1b[32m%s\x1b[0m", "-> Starting Frontend Vite Server (Port 5173)...");
const viteBin = path.join(__dirname, "client", "node_modules", "vite", "bin", "vite.js");

const frontend = spawn(nodePath, [viteBin], {
  cwd: path.join(__dirname, "client"),
  stdio: "pipe",
});

frontend.stdout.on("data", (data) => {
  process.stdout.write(`\x1b[32m[Frontend]\x1b[0m ${data}`);
});

frontend.stderr.on("data", (data) => {
  process.stderr.write(`\x1b[31m[Frontend Error]\x1b[0m ${data}`);
});

const shutdown = () => {
  console.log("\n\x1b[33m%s\x1b[0m", "Shutting down servers...");
  backend.kill();
  frontend.kill();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
