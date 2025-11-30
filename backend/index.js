const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Recursive function to load routes
const loadRoutes = (dir, prefix = "") => {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Check if directory matches METHOD__name pattern
      if (file.includes("__")) {
        const [method, routeName] = file.split("__");
        const routePath = `${prefix}/${routeName}`;

        // Check for index.js inside
        const modulePath = path.join(fullPath, "index.js");
        if (fs.existsSync(modulePath)) {
          try {
            const routerModule = require(modulePath);
            if (typeof routerModule === "function") {
              app[method.toLowerCase()](routePath, routerModule);
              console.log(`Loaded route: ${method.toUpperCase()} ${routePath}`);
            } else {
              console.warn(
                `Module at ${modulePath} does not export a function.`
              );
            }
          } catch (err) {
            console.error(`Error loading route ${fullPath}:`, err);
          }
        }

        // Also continue recursion for nested routes if needed,
        // though the naming convention suggests leaf nodes are the endpoints.
        // If we want nested structure like /user/data where data is a folder inside user:
        // We need to handle that. The user said:
        // /user/login -> routers/user/login (implied)
        // But also said: "routers/api/GET__login/index.js" for GET /api/login

        // Let's adjust the logic to traverse folders and look for the special naming convention.
      } else {
        // Regular directory, append to prefix
        loadRoutes(fullPath, `${prefix}/${file}`);
      }
    }
  });
};

// Improved Router Loading Logic based on user spec
// Spec: /api/login -> routers/api/GET__login/index.js
// Spec: /user/login -> routers/user/GET__login/index.js (inferred)

const loadRoutesV2 = (baseDir, currentPath = "") => {
  if (!fs.existsSync(baseDir)) return;

  const items = fs.readdirSync(baseDir);

  items.forEach((item) => {
    const fullPath = path.join(baseDir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (item.includes("__")) {
        // It's an endpoint definition: METHOD__name
        const [method, name] = item.split("__");
        // The actual route path is currentPath + / + name
        // Example: baseDir=routers/api, item=GET__login -> path=/api/login

        // Handle dynamic parameters [id] -> :id
        const finalName = name.replace(/\[(.*?)\]/g, ":$1");
        const routePath = `${currentPath}/${finalName}`.replace("//", "/");

        const modulePath = path.join(fullPath, "index.js");
        if (fs.existsSync(modulePath)) {
          const handler = require(modulePath);
          // Support array of middlewares
          if (Array.isArray(handler)) {
            app[method.toLowerCase()](routePath, ...handler);
          } else {
            app[method.toLowerCase()](routePath, handler);
          }
          console.log(`[Route] ${method.toUpperCase()} ${routePath}`);
        }
      } else {
        // It's a path segment
        loadRoutesV2(fullPath, `${currentPath}/${item}`);
      }
    }
  });
};

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const routersPath = path.join(__dirname, "routers");
console.log("Loading routes from:", routersPath);
loadRoutesV2(routersPath);

app.get("/", (req, res) => {
  res.send("Satu Data+ Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
