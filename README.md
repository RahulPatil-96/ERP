# ERP - Full Stack Application

This repository contains the backend and frontend code for the Edu ERP (Enterprise Resource Planning) system. The backend is built with NestJS, a progressive Node.js framework, and the frontend is built with React and Vite.

## Prerequisites

- Node.js (v16 or higher recommended)
- npm (comes with Node.js)
- Git (optional, for cloning the repository)

## Installation

1. Clone the repository (if not already done):

```bash
git clone <repository-url>
cd erp
```

2. Install dependencies for the root (frontend) and backend:

```bash
npm install
cd backend
npm install
cd ..
```

## Running the Application

### Run Backend Server

Navigate to the backend directory and start the NestJS server:

```bash
cd backend
npm run start:dev
```

This will start the backend in development mode with hot-reloading.

### Run Frontend Server

In the root directory, start the React development server:

```bash
npm run dev
```

This will start the frontend Vite development server.

### Run Both Backend and Frontend Concurrently

You can run both servers concurrently from the root directory using:

```bash
npm run start:all
```

This command uses `concurrently` to start the backend and frontend servers together.

## Building the Application

### Build Frontend

To build the frontend for production:

```bash
npm run build
```

### Build Backend

To build the backend for production:

```bash
cd backend
npm run build
cd ..
```

## Preview Frontend Build

To preview the production build of the frontend:

```bash
npm run preview
```

## Testing Backend

The backend includes unit and e2e tests. To run tests:

```bash
cd backend
npm run test
```

For e2e tests:

```bash
npm run test:e2e
```

To check test coverage:

```bash
npm run test:cov
```

## Deployment

For deploying the backend NestJS application, refer to the [NestJS deployment documentation](https://docs.nestjs.com/deployment).

You can also deploy using the official NestJS Mau platform:

```bash
npm install -g @nestjs/mau
mau deploy
```

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Discord Channel for NestJS](https://discord.gg/G7Qnnhy)

## License

This project is licensed under the MIT License.

---

*This README was updated to include comprehensive instructions for running both frontend and backend parts of the Edu ERP system.*
