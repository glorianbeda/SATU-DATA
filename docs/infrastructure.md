# Infrastructure & Architecture

## Overview
Satu Data+ is a web application built with a microservices-ready architecture using Docker. It consists of a React frontend, a Node.js backend, and a MySQL database.

## Folder Structure
```
/
├── backend/                # Node.js Express Backend
│   ├── routers/            # File-based routing modules
│   │   └── api/            # API routes
│   ├── prisma/             # Prisma ORM configuration
│   ├── Dockerfile          # Backend Docker image definition
│   └── index.js            # Entry point
├── frontend/               # React + Vite Frontend
│   ├── src/                # Source code
│   │   ├── components/     # Reusable UI components
│   │   └── theme.js        # Material UI Theme configuration
│   └── Dockerfile          # Frontend Docker image definition
├── docs/                   # Project Documentation
└── docker-compose.yml      # Docker orchestration
```

## Docker Configuration
The application is containerized using Docker Compose.

### Services
1.  **Backend**: Node.js application running Express.
2.  **Frontend**: Nginx server hosting the built React application.
3.  **Database**: MySQL 8.0 instance.

## Routing Architecture (Backend)
The backend uses a strict file-based routing system.
-   **Pattern**: `routers/<path>/<METHOD>__<name>/index.js`
-   **Example**: `GET /api/login` -> `routers/api/GET__login/index.js`
-   **Dynamic Routes**: `GET /api/user/:id` -> `routers/api/GET__user/[id].js` (Implementation detail to be refined in code)

## Database
-   **ORM**: Prisma
-   **Engine**: MySQL
