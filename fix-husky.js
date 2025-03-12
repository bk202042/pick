const fs = require('fs');
const path = require('path');

// Read package.json
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Remove husky-related scripts
if (packageJson.scripts.prepare && packageJson.scripts.prepare.includes('husky')) {
  delete packageJson.scripts.prepare;
  console.log('Removed husky prepare script');
}

if (packageJson.scripts.postinstall && packageJson.scripts.postinstall.includes('husky')) {
  delete packageJson.scripts.postinstall;
  console.log('Removed husky postinstall script');
}

// Remove husky from devDependencies if it exists
if (packageJson.devDependencies && packageJson.devDependencies.husky) {
  delete packageJson.devDependencies.husky;
  console.log('Removed husky from devDependencies');
}

// Write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('Updated package.json successfully');

// Remove .husky directory if it exists
const huskyDir = path.join(__dirname, '.husky');
if (fs.existsSync(huskyDir)) {
  try {
    fs.rmSync(huskyDir, { recursive: true, force: true });
    console.log('Removed .husky directory');
  } catch (error) {
    console.error('Error removing .husky directory:', error);
  }
}

console.log('Husky cleanup completed successfully');
