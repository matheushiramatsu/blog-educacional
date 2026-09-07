import { db } from "./database.js";
import { hashPassword } from "./security.js";

const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("Preencha ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD no arquivo .env.");
}

db.prepare(`
  INSERT INTO users (name, email, password_hash)
  VALUES (?, ?, ?)
  ON CONFLICT(email) DO UPDATE SET
    name = excluded.name,
    password_hash = excluded.password_hash
`).run(ADMIN_NAME.trim(), ADMIN_EMAIL.trim().toLowerCase(), hashPassword(ADMIN_PASSWORD));

console.log("Usuário administrador salvo.");
db.close();
