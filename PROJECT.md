# Voz Clone — Kế hoạch stack & tính năng

Tài liệu tham chiếu: công nghệ nền, lộ trình tính năng kiểu forum (Voz), và gợi ý thư viện **cài thêm theo từng feature** sau khi skeleton đã chạy.

## Cấu trúc repo

```
voz_clone/
├── PROJECT.md          ← file này
├── docker-compose.yml  ← PostgreSQL dev
├── backend/            ← NestJS + TypeORM + PostgreSQL
└── frontend/           ← Next.js (App Router)
```

## Stack cố định (đã cài tối thiểu trong skeleton)

| Lớp | Công nghệ |
|-----|-----------|
| Backend | NestJS, TypeScript (strict), TypeORM, PostgreSQL driver (`pg`) |
| Config / API doc | `@nestjs/config`, `@nestjs/swagger` |
| Validation | `class-validator`, `class-transformer` |
| Auth (nền) | `@nestjs/passport`, `@nestjs/jwt`, `passport`, `passport-jwt`, `bcrypt` |
| Bảo vệ cơ bản | `@nestjs/throttler` |
| Health | `@nestjs/terminus` |
| Frontend | Next.js, React, TypeScript, ESLint, Tailwind CSS |
| Gọi API / state server data | `axios`, `@tanstack/react-query` |

**Chưa cài sẵn (theo từng tính năng):** Redis, BullMQ, upload S3, OpenSearch/Meilisearch, Socket.io, OpenTelemetry, Pino chi tiết, v.v. — xem bảng dưới.

---

## Tính năng → công nghệ đi kèm (cài khi làm tới feature)

### 1. Tài khoản & phiên đăng nhập

| Tính năng | Cài thêm gợi ý |
|-----------|----------------|
| Refresh token / revoke | Entity `RefreshToken`, có thể thêm **Redis** (`ioredis`, `@nestjs-modules/ioredis` hoặc tự wrap) cho blacklist |
| Email xác minh / quên MK | `nodemailer` hoặc SDK (SES, Resend), **BullMQ** (`@nestjs/bullmq`, `bullmq`) + Redis |
| OAuth | `passport-google-oauth20` (hoặc strategy tương ứng) |

### 2. Hồ sơ & avatar

| Tính năng | Cài thêm gợi ý |
|-----------|----------------|
| Upload multipart | `@nestjs/platform-express` + `multer` (đã có qua Nest), hoặc **presigned URL** tới **AWS SDK** / **MinIO** |
| Resize ảnh | `sharp` |

### 3. Cấu trúc diễn đàn (category / box)

| Tính năng | Ghi chú |
|-----------|---------|
| Cây forum | TypeORM `@Tree` hoặc `parentId`; **Guard** + **Role** Nest |

### 4. Thread & Post

| Tính năng | Ghi chú |
|-----------|---------|
| CRUD, phân trang | TypeORM `Repository` / `QueryBuilder`, transaction; index DB |
| Hot thread cache | **Redis** |

### 5. Nội dung (BBCode, quote, mention)

| Tính năng | Cài thêm gợi ý |
|-----------|----------------|
| Sanitize HTML | `sanitize-html` hoặc `isomorphic-dompurify` |
| Mention / notify | Parser + entity `Notification`; realtime → **Socket.io** / `@nestjs/websockets` |

### 6. Reaction / like

| Tính năng | Ghi chú |
|-----------|---------|
| Chống spam | `@nestjs/throttler` (đã có) + Redis (optional) |

### 7. Tìm kiếm

| Tính năng | Cài thêm gợi ý |
|-----------|----------------|
| Full-text đơn giản | PostgreSQL `tsvector` + query raw / QueryBuilder |
| Search nâng cao | Client **Meilisearch** / **OpenSearch** + job đồng bộ (**BullMQ**) |

### 8. Moderation & audit

| Tính năng | Ghi chú |
|-----------|---------|
| Report, ban, log | Entity TypeORM; email/slack notify → queue |

### 9. Observability & load test

| Mục tiêu | Cài thêm gợi ý |
|----------|----------------|
| Metrics | `prom-client`, Grafana/Prometheus |
| Log JSON | `nestjs-pino`, `pino` |
| Trace | `@opentelemetry/*` |
| Load test | **k6** / **Artillery** (script trong repo, chạy local/CI) |

---

## Lộ trình gợi ý (theo phase)

1. **Phase 1:** Auth (register/login/JWT), User entity, Swagger, migration TypeORM, healthcheck.
2. **Phase 2:** Forum tree + Thread + Post + pagination.
3. **Phase 3:** Redis + BullMQ (email, notification async).
4. **Phase 4:** Search (Postgres rồi Meilisearch nếu cần).
5. **Phase 5:** Realtime (WebSocket), upload file, metrics + k6.

---

## Chạy local

1. **PostgreSQL:** từ thư mục gốc repo: `docker compose up -d`
2. **Backend:** `cd backend && cp .env.example .env && npm run start:dev` — API `http://localhost:3000`, Swagger `http://localhost:3000/api/docs`
3. **Frontend:** `cd frontend && cp .env.example .env.local && npm run dev` — app `http://localhost:3001` (tránh trùng cổng với Nest)

Biến môi trường: `backend/.env.example`, `frontend/.env.example`. CORS backend mặc định cho phép `http://localhost:3001` (`CORS_ORIGIN` nếu cần đổi).

---

## Ghi chú

- ORM: **TypeORM** (không dùng Prisma) theo yêu cầu.
- Mỗi feature mới: thêm module Nest + migration + (nếu cần) package từ bảng trên.
