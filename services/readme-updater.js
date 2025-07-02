const fs = require("fs");

// Lire le fichier package.json
const packageJson = JSON.parse(
  fs.readFileSync("./frontend/package.json", "utf8")
);
const composerJson = JSON.parse(
  fs.readFileSync("./backend/composer.json", "utf8")
);

// Extraire les versions des dépendances
const reactVersion = packageJson.dependencies.react;
const viteVersion = packageJson.devDependencies.vite;
const phpVersion = composerJson.require.php;
const symfonyVersion = composerJson.require["symfony/console"];
const typescriptVersion = packageJson.devDependencies.typescript;

// Vérifier que les versions extraites sont correctes
console.log("Versions extraites :");
console.log(`React: ${reactVersion}`);
console.log(`Vite: ${viteVersion}`);
console.log(`PHP: ${phpVersion}`);
console.log(`Symfony: ${symfonyVersion}`);
console.log(`TypeScript: ${typescriptVersion}`);

// Lire le fichier README.md
let readmeContent = fs.readFileSync("./README.md", "utf8");

// Mettre à jour les sections de versions
readmeContent = readmeContent
  .replace(
    /<strong>PHP<\/strong><br\/>\s*Version: \d+\.\d+\.\d+/g,
    `<strong>PHP</strong><br/> Version: ${phpVersion}`
  )
  .replace(
    /<strong>Symfony<\/strong><br\/>\s*Version: \d+\.\d+\.\d+/g,
    `<strong>Symfony</strong><br/> Version: ${symfonyVersion}`
  )
  .replace(
    /<strong>React<\/strong><br\/>\s*Version: \d+\.\d+\.\d+/g,
    `<strong>React</strong><br/> Version: ${reactVersion}`
  )
  .replace(
    /<strong>Vite<\/strong><br\/>\s*Version: \d+\.\d+\.\d+/g,
    `<strong>Vite</strong><br/> Version: ${viteVersion}`
  )
  .replace(
    /<strong>TypeScript<\/strong><br\/>\s*Version: \d+\.\d+\.\d+/g,
    `<strong>TypeScript</strong><br/> Version: ${typescriptVersion}`
  );

// Écrire les modifications dans README.md
fs.writeFileSync("./README.md", readmeContent);
console.log("README.md updated successfully.");
