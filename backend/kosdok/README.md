# Kosdok Backend

## Development Setup

1. Install dependencies:

```bash
npm install
```

2. Create local development env file:

```bash
cp .env.example .env.development
```

3. Start MySQL in Docker:

```bash
npm run dev:up
```

4. Generate and apply migrations:

```bash
npm run db:generate
npm run db:migrate
```

5. Run seeders (optional):

```bash
npm run seed

# run a specific module seeder
npm run seed -- identity
npm run seed -- user
```

6. Start API in development mode:

```bash
npm run start:dev
```

7. Open API docs:

```bash
http://localhost:3000/docs
```

8. Open Mailpit inbox (development emails):

```bash
http://localhost:8025
```

## Environment files

- Development: `.env.development`
- Test: `.env.test`
- Production: `.env.production`

Config loading order:
- `.env.<NODE_ENV>.local`
- `.env.<NODE_ENV>`
- `.env.local`
- `.env`

## Useful Commands

```bash
# stop MySQL container
npm run dev:down

# view MySQL + Mailpit logs
npm run dev:infra:logs

# open Drizzle Studio
npm run db:studio
```
