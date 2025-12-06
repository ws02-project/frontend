# Frontend - WSO2 Project

A modern, responsive frontend application built with React, TypeScript, and Vite. This application provides a user interface for managing projects, tasks, and team members.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Configuration](#environment-configuration)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **pnpm** (v8.0.0 or higher) - Install with: `npm install -g pnpm`

To verify your installations:
```bash
node --version
pnpm --version
```

## 🚀 Getting Started

Follow these steps to set up and run the frontend application after cloning:

### 1. Navigate to the Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
Install all required packages using pnpm:
```bash
pnpm install
```

This will install:
- React & React DOM (v19.2.0)
- React Router DOM (for navigation)
- Axios (for API requests)
- Tailwind CSS (for styling)
- TypeScript (for type safety)
- Vite (build tool)
- And other development dependencies

### 3. Start the Development Server
```bash
pnpm dev
```

The application will start on `http://localhost:5173` (or the next available port if 5173 is in use).

### 4. Open in Browser
Navigate to:
```
http://localhost:5173
```

You should see the application running! 🎉

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Starts the development server with Hot Module Replacement (HMR) |
| `pnpm build` | Creates an optimized production build in the `dist` folder |
| `pnpm lint` | Runs ESLint to check code quality and style issues |
| `pnpm preview` | Previews the production build locally |

### Detailed Script Usage

#### Development Mode
```bash
pnpm dev
```
- Starts Vite dev server
- Enables hot module replacement for instant updates
- Runs on `http://localhost:5173` by default

#### Production Build
```bash
pnpm build
```
- Compiles TypeScript
- Bundles and optimizes code
- Outputs to `dist/` directory

#### Preview Production Build
```bash
pnpm preview
```
- Serves the production build locally
- Useful for testing before deployment

## 🛠️ Tech Stack

This project is built with modern web technologies:

- **[React](https://react.dev/)** (v19.2.0) - UI library
- **[TypeScript](https://www.typescriptlang.org/)** (v5.9.3) - Type safety
- **[Vite](https://vitejs.dev/)** (v7.2.4) - Build tool and dev server
- **[React Router DOM](https://reactrouter.com/)** (v7.9.6) - Client-side routing
- **[Tailwind CSS](https://tailwindcss.com/)** (v4.1.17) - Utility-first CSS framework
- **[Axios](https://axios-http.com/)** (v1.13.2) - HTTP client for API requests
- **[ESLint](https://eslint.org/)** - Code linting and quality

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/          # Page components
│   ├── services/       # API service layer
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles (Tailwind)
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## ⚙️ Environment Configuration

### Backend API Configuration

If you need to connect to backend services, create a `.env` file in the frontend root directory:

```env
VITE_API_URL=http://localhost:8080
VITE_TASK_SERVICE_URL=http://localhost:8081
VITE_PROJECT_SERVICE_URL=http://localhost:8082
```

> **Note:** Environment variables in Vite must be prefixed with `VITE_` to be exposed to the client.

Access these variables in your code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 💻 Development

### Code Quality

Run ESLint to check for code issues:
```bash
pnpm lint
```

### Hot Module Replacement (HMR)

Vite provides instant HMR, so changes to your code will be reflected immediately in the browser without a full page reload.

### TypeScript

This project uses TypeScript for type safety. The TypeScript compiler will check your code during development and build.

### Styling with Tailwind CSS

This project uses Tailwind CSS v4. Add utility classes directly in your JSX:

```tsx
<div className="flex items-center justify-center p-4 bg-blue-500">
  <h1 className="text-2xl font-bold text-white">Hello World</h1>
</div>
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Dependencies Won't Install
```bash
# Clear pnpm cache and reinstall
pnpm store prune
pnpm install --force
```

#### Port Already in Use
Vite will automatically try the next available port (5174, 5175, etc.). Check the terminal output for the actual port being used.

#### Tailwind CSS Not Working
Ensure these files are properly configured:
- `postcss.config.js`
- `tailwind.config.js`
- `src/index.css` (should include Tailwind directives)

#### TypeScript Errors
Run the build command to see detailed type errors:
```bash
pnpm build
```

#### Backend Connection Issues
- Ensure backend services are running
- Check `.env` file for correct API URLs
- Verify CORS is enabled on the backend

#### Module Not Found Errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm lint` to check code quality
4. Test your changes with `pnpm dev`
5. Build to ensure no errors: `pnpm build`
6. Submit a pull request

---

**Happy Coding!** 🚀
