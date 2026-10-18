# 🐾 Pet Radar — API

Backend da aplicação Pet Radar: mapa colaborativo para animais perdidos e encontrados no Brasil.

---

## 🛠 Tecnologias

- **Node.js** + **TypeScript**
- **Express** — API REST
- **PostgreSQL** — banco de dados
- **node-pg-migrate** — migrations
- **JWT** — autenticação
- **Bcrypt** — hash de senhas
- **Cloudinary** — armazenamento de fotos
- **Resend** — envio de emails
- **Zod** — validação de dados
- **Vitest** — testes unitários

---

## 🏗 Estrutura

src/
├── controllers/ # Handlers HTTP
├── use-cases/ # Regras de negócio
├── repositories/ # Acesso ao banco (PostgreSQL)
├── services/ # Cloudinary, Resend
├── middlewares/ # Auth JWT, upload Multer
├── migrations/ # Schema do banco
├── routes/ # Definição das rotas
└── tests/ # Testes unitários


---

## 📡 Endpoints

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/api/auth/register` | ❌ | Criar conta |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/me` | ✅ | Usuário autenticado |
| GET | `/api/reports` | ❌ | Listar reports ativos |
| POST | `/api/reports` | ✅ | Criar report com foto |
| GET | `/api/reports/my` | ✅ | Meus reports |
| GET | `/api/reports/:id` | ❌ | Detalhes do report |

---

## 🚀 Rodando localmente

```bash
npm install
cp .env.example .env
npm run migrate
npm run dev
```

---

## 🔑 Variáveis de ambiente

```env
DATABASE_URL=postgresql://user:password@localhost:5432/petradar
JWT_SECRET=sua_chave_secreta
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RESEND_API_KEY=...
```

---

## 🧪 Testes

```bash
npm test
```

---

## ☁️ Deploy

Hospedado no **Railway** com PostgreSQL gerenciado.  
As migrations rodam automaticamente no start via `npm run migrate && node dist/server.js`.