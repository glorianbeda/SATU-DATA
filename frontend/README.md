# Satu Data+ Frontend

This project uses React + Vite with Material UI.

## Auto-Routing
We use [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages) for file-based routing.
-   Files in `src/pages` automatically become routes.
-   Example: `src/pages/about.jsx` -> `/about`
-   Example: `src/pages/user/profile.jsx` -> `/user/profile`

## Page Generator
To quickly create a new page, use the following command:

```bash
npm run make:page <page-name>
```

Examples:
```bash
npm run make:page dashboard
npm run make:page settings/profile
```

## Feature Generator
To create a new feature with the standard structure (components, constants, interfaces), use:

```bash
npm run make:feature <feature-name>
```

Example:
```bash
npm run make:feature user-profile
```

## Module Generator (Recommended)
To create a complete module (Feature + Page) in one go:

```bash
npm run make:module <name>
```

Example:
```bash
npm run make:module dashboard
```
This will create:
1.  `src/features/dashboard` (Logic & Layout)
2.  `src/pages/dashboard.jsx` (Route)

## Dependency Management (Docker)
Since the frontend runs inside a Docker container, use the following command to install new packages:

```bash
docker compose exec frontend npm install <package-name>
```

Example:
```bash
docker compose exec frontend npm install axios
```
