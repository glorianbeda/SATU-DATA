import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pageName = process.argv[2];

if (!pageName) {
  console.error("Please provide a page name. Usage: npm run make:page <name>");
  process.exit(1);
}

// Handle nested paths (e.g., tools/productivity/notebook)
// Creates folder-based structure: tools/productivity/notebook/index.jsx
const parts = pageName.split("/");
const folderName = parts[parts.length - 1];
const dirPath = path.join(__dirname, "../src/pages", ...parts);

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const filePath = path.join(dirPath, "index.jsx");

if (fs.existsSync(filePath)) {
  console.error(`Page ${filePath} already exists.`);
  process.exit(1);
}

const componentName = folderName
  .split("-")
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join("");

const content = `import React from 'react';
import { Box, Typography } from '@mui/material';

const ${componentName} = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">${componentName} Page</Typography>
    </Box>
  );
};

export default ${componentName};
`;

fs.writeFileSync(filePath, content);
console.log(`Page created at ${filePath}`);
