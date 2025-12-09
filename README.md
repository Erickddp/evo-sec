# EVOSEC - Security Platform - lap

Monorepo for the EVOSEC security platform.---

## Structure

- `apps/web`: React + Vite + Tailwind frontend.
- `apps/api`: Fastify + TypeScript backend.
- `packages/shared`: Shared TypeScript types and utilities.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server (Web + API):
   ```bash
   npm run dev
   ```

   - Web: http://localhost:5173
   - API: http://localhost:4000

## Architecture

- **Frontend**: Uses Tailwind for styling with manual dark mode (`.dark` class on `<html>`). State management via React hooks.
- **Backend**: Fastify for high performance. CORS enabled for dev.
- **Shared**: Types defined in `packages/shared` are imported by both apps using `@evosec/shared`.

## Dark Mode

The dark mode preference is saved in `localStorage` key `evosec-theme`.

## API

- `GET /health`: Check system status.
- `GET /config/security`: Get scan configuration.
"# evo-sec" 
