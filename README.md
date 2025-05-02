# AdonisJS + Next.js Template with Ant Design

This is a full-stack application template that combines:
- AdonisJS (backend)
- Next.js (frontend)
- Ant Design (UI components)
- Authentication system with roles and permissions

## Project Structure

This is a monorepo managed with Turborepo:

- `/apps/server` - AdonisJS backend with authentication and roles
- `/apps/client` - Next.js frontend with Ant Design UI

## Features

- User authentication (login/register)
- Role-based permissions
- Modern UI with Ant Design components
- TypeScript for type safety
- Ready-to-use database migrations

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/adonisjs-nextjs-template.git
cd adonisjs-nextjs-template
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both the server and client directories
   - Update the database connection settings in the server `.env` file

4. Run database migrations:
```bash
cd apps/server
node ace migration:run
```

5. Start the development servers:
```bash
# From the root directory
npm run dev
```

This will start both the server (http://localhost:3333) and client (http://localhost:3000) applications.

## Development Commands

### Root commands (all apps)
- `npm run dev` - Start all applications in development mode
- `npm run build` - Build all applications

### Server commands
- `cd apps/server && npm run dev` - Start server in development mode
- `cd apps/server && npm run lint` - Run linting checks
- `cd apps/server && npm run format` - Format code
- `cd apps/server && npm run typecheck` - Check TypeScript types
- `cd apps/server && npm run test` - Run tests

### Client commands
- `cd apps/client && npm run dev` - Start client in development mode
- `cd apps/client && npm run build` - Build client application
- `cd apps/client && npm run lint` - Run linting checks
- `cd apps/client && npm run format` - Format code

## Technologies

### Backend (AdonisJS)
- AdonisJS 6 - TypeScript-first Node.js framework
- Lucid ORM - Database ORM
- JWT authentication
- Role-based authorization

### Frontend (Next.js)
- Next.js 15 - React framework
- React 19 - UI library
- Ant Design - Component library with beautiful UI
- TypeScript - Type safety

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.