import express from "express";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { db, toPost } from "./database.js";
import { createToken, readToken, verifyPassword } from "./security.js";

if (!process.env.TOKEN_SECRET || process.env.TOKEN_SECRET === "defina-uma-chave-segura") {
  throw new Error("Defina TOKEN_SECRET no arquivo .env.");
}

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.post("/api/auth/login", (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user || !verifyPassword(String(req.body.password || ""), user.password_hash)) {
    return res.status(401).json({ message: "E-mail ou senha inválidos." });
  }

  return res.json({
    token: createToken(user),
    user: { name: user.name, email: user.email },
  });
});

app.get("/api/posts", (_req, res) => {
  const posts = db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all().map(toPost);
  res.json(posts);
});

app.get("/api/posts/:id", (req, res) => {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
  if (!post) return res.status(404).json({ message: "Post não encontrado." });
  return res.json(toPost(post));
});

app.post("/api/posts", authenticate, (req, res) => {
  const post = readPost(req, res);
  if (!post) return;

  const result = db.prepare(`
    INSERT INTO posts (title, content, author, user_id) VALUES (?, ?, ?, ?)
  `).run(post.title, post.content, post.author, req.user.id);
  const created = db.prepare("SELECT * FROM posts WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(toPost(created));
});

app.put("/api/posts/:id", authenticate, (req, res) => {
  const post = readPost(req, res);
  if (!post) return;

  const result = db.prepare(`
    UPDATE posts
    SET title = ?, content = ?, author = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(post.title, post.content, post.author, req.params.id);
  if (!result.changes) return res.status(404).json({ message: "Post não encontrado." });

  const updated = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
  return res.json(toPost(updated));
});

app.delete("/api/posts/:id", authenticate, (req, res) => {
  const result = db.prepare("DELETE FROM posts WHERE id = ?").run(req.params.id);
  if (!result.changes) return res.status(404).json({ message: "Post não encontrado." });
  return res.status(204).end();
});

const distPath = resolve("dist");
app.use(express.static(distPath));
app.use((req, res, next) => {
  const indexPath = resolve(distPath, "index.html");
  if (req.method === "GET" && !req.path.startsWith("/api") && existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return next();
});

app.use((_req, res) => res.status(404).json({ message: "Rota não encontrada." }));
app.listen(port, () => console.log(`Servidor disponível em http://localhost:${port}`));

function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const user = readToken(token);
  if (!user) return res.status(401).json({ message: "Acesso não autorizado." });
  req.user = user;
  return next();
}

function readPost(req, res) {
  const post = {
    title: String(req.body.title || "").trim(),
    content: String(req.body.content || "").trim(),
    author: String(req.body.author || "").trim(),
  };
  if (Object.values(post).some((value) => !value)) {
    res.status(400).json({ message: "Título, conteúdo e autor são obrigatórios." });
    return null;
  }
  return post;
}
