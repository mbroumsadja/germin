const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Vérifier que inquirer est installé et compatible
let inquirer;
try {
  inquirer = require('inquirer');
  if (typeof inquirer.prompt !== 'function') {
    throw new Error('inquirer.prompt is not a function. Ensure you are using inquirer@8. Run: npm install inquirer@8');
  }
} catch (error) {
  console.error('Erreur : Le module "inquirer" n\'est pas installé ou est incompatible.');
  console.error('Installez-le avec : npm install inquirer@8');
  console.error('Détails de l\'erreur :', error.message);
  process.exit(1);
}

async function createProject() {
  try {
    // Questions pour l'utilisateur
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Entrez le nom du projet :',
        default: 'mon-projet',
        validate: input => /^[a-zA-Z0-9-_]+$/.test(input) ? true : 'Le nom du projet ne doit contenir que des lettres, chiffres, tirets ou underscores.'
      },
      {
        type: 'confirm',
        name: 'includeJs',
        message: 'Voulez-vous inclure un fichier JavaScript (script.js) ?',
        default: true
      },
      {
        type: 'confirm',
        name: 'initGit',
        message: 'Voulez-vous initialiser un dépôt Git ?',
        default: false
      },
      {
        type: 'confirm',
        name: 'githubRepo',
        message: 'Voulez-vous créer un dépôt GitHub et le configurer ?',
        default: false,
        when: answers => answers.initGit
      }
    ]);

    const { projectName, includeJs, initGit, githubRepo } = answers;
    const projectPath = path.join(process.cwd(), projectName);

    // Créer la structure des dossiers
    await fs.mkdir(projectPath);
    await fs.mkdir(path.join(projectPath, 'public'));
    await fs.mkdir(path.join(projectPath, 'public', 'css'));

    // Créer index.html avec navbar, main et footer
    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <link rel="stylesheet" href="css/style.css">
  ${includeJs ? '<script src="js/script.js" defer></script>' : ''}
</head>
<body>
  <nav>
    <ul>
      <li><a href="#">Accueil</a></li>
      <li><a href="#">À propos</a></li>
    </ul>
  </nav>
  <main>
    <h1>Bienvenue dans ${projectName} !</h1>
    <p>Ceci est votre premier projet web. Modifiez ce texte pour commencer !</p>
  </main>
  <footer>
    <p>© 2025 ${projectName}</p>
  </footer>
</body>
</html>
    `;
    await fs.writeFile(path.join(projectPath, 'public', 'index.html'), htmlContent.trim());

    // Créer style.css avec styles pour navbar, main et footer
    const cssContent = `
/* Styles de base pour ${projectName} */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
}

nav {
  background-color: #333;
  padding: 10px;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
  justify-content: center;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

nav a:hover {
  text-decoration: underline;
}

main {
  max-width: 800px;
  margin: 20px auto;
  text-align: center;
}

h1 {
  color: #333;
}

footer {
  text-align: center;
  padding: 10px;
  background-color: #ddd;
  position: fixed;
  bottom: 0;
  width: 100%;
}
    `;
    await fs.writeFile(path.join(projectPath, 'public', 'css', 'style.css'), cssContent.trim());

    // Créer script.js si demandé
    if (includeJs) {
      await fs.mkdir(path.join(projectPath, 'public', 'js'));
      const jsContent = `
// Script JavaScript pour ${projectName}
document.addEventListener('DOMContentLoaded', () => {
  console.log('Bienvenue dans ${projectName} !');
});
      `;
      await fs.writeFile(path.join(projectPath, 'public', 'js', 'script.js'), jsContent.trim());
    }

    // Créer package.json avec live-server
    const packageJson = {
      name: projectName,
      version: "1.0.0",
      description: `Projet généré pour ${projectName}`,
      scripts: {
        start: "live-server public --port=8080"
      },
      devDependencies: {
        "live-server": "^1.2.2"
      }
    };
    await fs.writeFile(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));
    console.log('Installation des dépendances...');
    execSync('npm install', { cwd: projectPath, stdio: 'inherit' });

    // Créer README.md détaillé
    const readmeContent = `
# ${projectName}

Bienvenue dans votre premier projet web !

## Structure
- \`public/\` : Contient les fichiers accessibles au navigateur.
  - \`index.html\` : Page principale avec une navbar, une section principale et un footer.
  - \`css/style.css\` : Styles de votre site.
  ${includeJs ? '- `js/script.js` : Logique JavaScript.' : ''}

## Prérequis
- Node.js installé (https://nodejs.org).
- Un navigateur web (Chrome, Firefox, etc.).

## Lancer le projet
1. Accédez au dossier du projet :
   \`\`\`bash
   cd ${projectName}
   \`\`\`
2. Installez les dépendances :
   \`\`\`bash
   npm install
   \`\`\`
3. Lancez le serveur :
   \`\`\`bash
   npm start
   \`\`\`
4. Ouvrez http://localhost:8080 dans votre navigateur.

## Prochaines étapes
- Modifiez \`index.html\` pour ajouter du contenu (ex. : images, texte).
- Personnalisez \`style.css\` pour changer l'apparence (ex. : couleurs, polices).
${includeJs ? '- Ajoutez des interactions dans `script.js` (ex. : boutons cliquables).' : ''}
- Consultez \`TODO.md\` pour des idées de tâches.

## Ressources
- [MDN Web Docs](https://developer.mozilla.org) : Documentation HTML, CSS, JS.
- [freeCodeCamp](https://www.freecodecamp.org) : Tutoriels gratuits.
- [W3Schools](https://www.w3schools.com) : Exemples pratiques.
    `;
    await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent.trim());

    // Créer TODO.md avec des tâches d'apprentissage
    const todoContent = `
# Tâches pour apprendre

- [ ] Ajoutez un bouton dans \`index.html\` avec le texte "Cliquez-moi".
- [ ] Stylisez le bouton dans \`style.css\` (ex. : couleur de fond, bordure, effet au survol).
${includeJs ? '- [ ] Faites afficher une alerte "Bonjour !" quand on clique sur le bouton dans `script.js`.' : ''}
- [ ] Créez une liste \`<ul>\` avec 3 éléments dans \`index.html\`.
- [ ] Centrez la liste avec CSS dans \`style.css\`.
- [ ] Ajoutez une image dans \`public/\` et affichez-la dans \`index.html\`.
    `;
    await fs.writeFile(path.join(projectPath, 'TODO.md'), todoContent.trim());

    // Initialiser Git si demandé
    if (initGit) {
      process.chdir(projectPath);
      execSync('git init');
      await fs.writeFile(path.join(projectPath, '.gitignore'), 'node_modules\n');
      
      if (githubRepo) {
        console.log('Pour créer un dépôt GitHub :');
        console.log('1. Créez un dépôt sur GitHub sans README ni .gitignore.');
        console.log('2. Exécutez ces commandes dans le dossier du projet :');
        console.log(`   git add .`);
        console.log(`   git commit -m "Initial commit"`);
        console.log(`   git remote add origin <URL_DU_DEPOT_GITHUB>`);
        console.log(`   git push -u origin main`);
      }
    }

    console.log(`Projet "${projectName}" créé avec succès dans ${projectPath} !`);
    console.log('Pour démarrer : cd ' + projectName + ' && npm start');
  } catch (error) {
    console.error('Erreur lors de la création du projet :', error.message);
    process.exit(1);
  }
}

createProject();