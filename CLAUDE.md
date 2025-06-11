# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- **Build**: `npm run build` (all apps) or `cd apps/[app] && npm run build` (specific app)
- **Lint**: `npm run lint` or `cd apps/server && npm run lint`
- **Format**: `cd apps/server && npm run format`
- **Type Check**: `cd apps/server && npm run typecheck`
- **Dev**: `npm run dev` (all apps) or `cd apps/[app] && npm run dev` (specific app)
- **Test**: `cd apps/server && npm run test`
- **Single Test**: `cd apps/server && node ace test tests/path/to/test.ts`

## Code Style Guidelines
- **Server (AdonisJS)**:
  - Follow AdonisJS conventions with decorators for models
  - Use imports from `@adonisjs/*` namespaces
  - Error handling follows AdonisJS exceptions system
  - For import paths, use the `#` alias system defined in package.json
  - Type definitions should use TypeScript's `declare` syntax
  
- **Client (Next.js)**:
  - Use Next.js conventions with React 19 syntax
  - Use strict TypeScript mode for type safety
  - Import aliases start with `@/` pointing to root

This is a monorepo with AdonisJS (backend) and Next.js (frontend) managed with Turborepo.