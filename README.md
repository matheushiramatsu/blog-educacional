# Blog educacional

Aplicação para leitura e administração de posts, com React, Bootstrap, Node.js e SQLite.

## Executar

Requisitos: Node.js 24 e npm.

```bash
npm install
copy .env.example .env
```

Preencha no `.env`:

```env
TOKEN_SECRET=uma-chave-segura
ADMIN_NAME=nome-do-administrador
ADMIN_EMAIL=email-do-administrador
ADMIN_PASSWORD=senha-do-administrador
```

Crie o usuário administrador:

```bash
npm run admin
```

Inicie a API e a interface em terminais separados:

```bash
npm run server
npm run dev
```

A interface abre em `http://localhost:5173`. O banco é criado automaticamente em `data/blog.db`.

## Produção

```bash
npm run build
npm start
```

O servidor publica a API e a interface em `http://localhost:3000`.

## Rotas da API

- `POST /api/auth/login`
- `GET /api/posts`
- `GET /api/posts/:id`
- `POST /api/posts`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`

As rotas de criação, edição e exclusão exigem o token retornado pelo login.

## Docker

```bash
docker build -t blog-educacional .
docker run --name blog-educacional -p 3000:3000 --env-file .env -v blog-data:/app/data blog-educacional
```

Para criar ou atualizar o administrador no contêiner:

```bash
docker exec \
  -e ADMIN_NAME="nome-do-administrador" \
  -e ADMIN_EMAIL="email-do-administrador" \
  -e ADMIN_PASSWORD="senha-do-administrador" \
  blog-educacional npm run admin
```
