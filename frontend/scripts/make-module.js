import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('Please provide a module name. Usage: npm run make:module <name>');
  process.exit(1);
}

// 1. Create Feature
const featurePath = path.join(__dirname, '../src/features', moduleName);

if (fs.existsSync(featurePath)) {
  console.error(`Feature ${moduleName} already exists.`);
  process.exit(1);
}

// Create directories
fs.mkdirSync(path.join(featurePath, 'components'), { recursive: true });
fs.mkdirSync(path.join(featurePath, 'constants'), { recursive: true });
fs.mkdirSync(path.join(featurePath, 'interfaces'), { recursive: true });

// Create index.js
const indexContent = `export * from './constants/api';
export { default as ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Layout } from './components/${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Layout';
`;
fs.writeFileSync(path.join(featurePath, 'index.js'), indexContent);

// Create constants/api.js
const apiContent = `// export const EXAMPLE_API = '/api/example';
`;
fs.writeFileSync(path.join(featurePath, 'constants/api.js'), apiContent);

// Create interfaces/index.js
const interfacesContent = `/**
 * @typedef {Object} ExampleInterface
 * @property {string} id
 */
`;
fs.writeFileSync(path.join(featurePath, 'interfaces/index.js'), interfacesContent);

// Create Layout Component
const layoutName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1) + 'Layout';
const layoutContent = `import React from 'react';
import { Box, Typography } from '@mui/material';

const ${layoutName} = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">${moduleName} Feature</Typography>
    </Box>
  );
};

export default ${layoutName};
`;
fs.writeFileSync(path.join(featurePath, `components/${layoutName}.jsx`), layoutContent);

console.log(`Feature ${moduleName} created at ${featurePath}`);

// 2. Create Page
// Handle nested paths (e.g., user/profile)
const parts = moduleName.split('/');
const fileName = parts.pop();
const dirPath = path.join(__dirname, '../src/pages', ...parts);

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const pagePath = path.join(dirPath, `${fileName}.jsx`);

if (fs.existsSync(pagePath)) {
  console.error(`Page ${pagePath} already exists.`);
  process.exit(1);
}

const pageComponentName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
const featureImportPath = parts.length > 0 
  ? `../../features/${moduleName}` 
  : `../features/${moduleName}`;

const pageContent = `import React from 'react';
import { ${layoutName} } from '${featureImportPath}';

const ${pageComponentName} = () => {
  return <${layoutName} />;
};

export default ${pageComponentName};
`;

fs.writeFileSync(pagePath, pageContent);
console.log(`Page created at ${pagePath}`);
