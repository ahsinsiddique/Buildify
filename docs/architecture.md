# Architecture Overview

## High-Level Design

The project is split into two deployable apps:

- `apps/web`: Next.js frontend for marketing pages and the authenticated dashboard
- `apps/api`: Express API exposing REST endpoints for business modules

PostgreSQL stores transactional data. JWT-based auth secures the API. The frontend calls the API through server or client components depending on the feature.

## Backend Layers

- `routes`: HTTP route registration and middleware composition
- `controllers`: request parsing and response formatting
- `services`: business logic and cross-table workflows
- `repositories`: SQL access and persistence concerns
- `middleware`: auth, role checks, and error handling
- `config`: environment and database configuration

## Frontend Layers

- `app`: route segments and page entry points
- `components`: reusable UI primitives and feature sections
- `lib`: API helpers, navigation metadata, and formatting utilities
- `types`: frontend-facing domain models

## Domain Model

Core entities:

- users
- properties
- clients
- consultations
- projects
- workers
- project_workers
- materials
- material_usage
- expenses
- invoices
- payments
- project_logs

## Roadmap Hooks

The structure leaves space for:

- alerts and notification services
- cost forecasting jobs
- document storage adapters
- multi-company tenancy
- pagination and reporting endpoints
