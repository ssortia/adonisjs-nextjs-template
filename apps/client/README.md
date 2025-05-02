# Next.js Client with Ant Design

The client-side application for the AdonisJS + Next.js template. This application uses Next.js with Ant Design components for the UI.

## Features

- Modern UI with Ant Design components
- Authentication system with role-based permissions
- Responsive design optimized for various devices
- TypeScript for enhanced type safety

## Getting Started

### Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be accessible at http://localhost:3000.

### Build

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Application Structure

- `/app` - Next.js app directory
- `/app/components` - Reusable components
- `/app/hooks` - Custom React hooks
- `/app/services` - API services
- `/public` - Static files

## UI Components

### Ant Design Integration

This project uses Ant Design v5 with React 19. We've integrated Ant Design with:

- Customized theming
- Russian language localization
- Server-side rendering support
- Responsive layouts

### Key Components

- `LoginForm` - Authentication form
- `RegisterForm` - User registration form
- `UserProfile` - User profile display
- Various Ant Design components (Layout, Button, Card, etc.)

## Authentication

Authentication is handled via the `useAuth` hook which provides:

- `login` - Login function
- `register` - Registration function
- `logout` - Logout function
- `user` - Current user data
- `userRole` - User role information
- `userPermissions` - User permissions array

## API Integration

API calls to the backend server are made using the service functions defined in `/app/services/api.ts`.

## Styling

We use a combination of:

- Ant Design's built-in styling system
- CSS Modules for component-specific styles
- Global CSS in `/app/globals.css`

## Development Guidelines

- Follow the component structure pattern in existing components
- Use Ant Design components where possible
- Keep components small and focused on a single responsibility
- Use TypeScript interfaces for props and state
- Follow ESLint and Prettier rules for code formatting

## Common Issues and Solutions

### Ant Design and React 19

Since Ant Design v5 officially supports React 16-18, but we're using React 19, we've added the compatibility patch:

```javascript
import '@ant-design/v5-patch-for-react-19';
```

This patch enables Ant Design to work with React 19 without issues.
