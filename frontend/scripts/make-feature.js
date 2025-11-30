import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const featureName = process.argv[2];

if (!featureName) {
  console.error('Please provide a feature name. Usage: npm run make:feature <name>');
  process.exit(1);
}

const featurePath = path.join(__dirname, '../src/features', featureName);

if (fs.existsSync(featurePath)) {
  console.error(`Feature ${featureName} already exists.`);
  process.exit(1);
}

// Create directories
fs.mkdirSync(path.join(featurePath, 'components'), { recursive: true });
fs.mkdirSync(path.join(featurePath, 'constants'), { recursive: true });
fs.mkdirSync(path.join(featurePath, 'interfaces'), { recursive: true });

// Create index.js
const indexContent = `export * from './constants/api';
// export * from './components/YourComponent';
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

console.log(`Feature ${featureName} created at ${featurePath}`);
