# Real Estate + Construction ERP

A starter monorepo for a real estate and construction management platform. It includes:

- `apps/api`: Express + PostgreSQL API starter with JWT auth foundations
- `apps/web`: Next.js App Router frontend starter with landing and dashboard pages
- `docs`: product and architecture documentation
- `database`: PostgreSQL schema and seed placeholders

## Product Scope

The MVP covers:

- User roles and access control
- Property and plot management
- Construction project tracking
- Workers, materials, expenses, invoices, and payments
- CRM and consultation tracking
- Dashboard analytics and daily progress logs

## Repository Structure

```text
apps/
  api/
  web/
database/
docs/
```

## Quick Start

### API

```bash
cd apps/api
npm install
npm run dev
```

### Web

```bash
cd apps/web
npm install
npm run dev
```

## Environment

Copy the example env files before starting:

- `apps/api/.env.example` -> `apps/api/.env`
- `apps/web/.env.example` -> `apps/web/.env.local`

## Database

When the API starts, it will:

- connect to your local PostgreSQL server
- create the `construction_app` database if it does not exist
- apply `database/schema.sql` automatically

If your local credentials differ, set `DATABASE_URL` or the `POSTGRES_*` variables in `apps/api/.env`.

## Next Build Steps

- Add migrations with Prisma, Drizzle, or Knex
- Replace mock dashboard data with API-backed queries
- Add file uploads for contracts and receipts
- Add automated tests for services and route handlers
