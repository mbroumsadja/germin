const TEMPLATES = {
  HTML: (project_name, options = {}) =>
    `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project_name}</title>
  ${options.css === 'bootstrap' ? '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">\n  ' : ''}<link rel="stylesheet" href="public/css/style.css">
  <meta name="theme-color" content="#000" />
</head>
<body>
  <header>
    <nav>
      <ul>
        <li><a href="#">Accueil</a></li>
        <li><a href="#">About</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <h1>Bienvenue dans ${project_name} !</h1>
    <p>Ceci est votre premier projet web statique.</p>
  </main>
  <footer>
    <p>${new Date().getFullYear()} ${project_name}</p>
  </footer>
  <script src="./js/script.js" defer></script>
</body>
</html>
  `,
  /**
   * CSS template for the main site styles (pure CSS).
   * @param {string} project_name - The name of the project (used in comments).
   * @returns {string} The CSS content.
   */
  CSS: (project_name) => `
/* Styles for ${project_name} */

:root {
  --primary-color: #242424;
  --background-color:rgba(6, 54, 32, 0.863);
  --text-color: #333;
  --footer-bg: #000000;
}

body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: var(--primary-color);
  color: white;
  padding: 10px 0;
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
  padding: 5px 10px;
  transition: color 0.3s ease;
}

nav a:hover {
  color: #ccc;
}

main {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
  text-align: center;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

h1, h2, h3 {
  color: var(--primary-color);
}

footer {
  text-align: center;
  background-color: var(--footer-bg);
  color: var(--text-color);
  width: 100%;
  padding: 10px 0;
}

@media (max-width: 600px) {
  nav ul {
    flex-direction: column;
    align-items: center;
  }
}
  `,
  JS: (project_name) => `
// script.js for ${project_name}
document.addEventListener('DOMContentLoaded', () => {
  console.log('Bienvenue dans ${project_name} ! Le DOM est entièrement chargé et analysé.');

  // Example: Add a simple interaction
  const mainHeading = document.querySelector('main h1');
  if (mainHeading) {
    mainHeading.addEventListener('mouseover', () => {
      mainHeading.style.color = 'white';
    });
    mainHeading.addEventListener('mouseout', () => {
      mainHeading.style.color = '';
    });
  }
});
`,
  /**
   * README template.
   * @param {string} project_name - The name of the project.
   * @returns {string} The README content.
   */
  README: (project_name) => `
# ${project_name} 🌱

Projet web statique créé avec [Germin](https://www.npmjs.com/package/germin).

## Démarrer

\`\`\`bash
npm install
npm run dev        # http://localhost:5173
\`\`\`

## Structure

\`\`\`
${project_name}/
├── index.html
├── public/
│   ├── css/style.css
│   ├── js/script.js
│   ├── assets/images/
│   └── pages/
├── x/                 # Kanban (si activé)
│   ├── kanban.html
│   └── task.json
├── germin.json        # configuration Germin
├── vite.config.js
└── package.json
\`\`\`

## Commandes utiles

| Commande | Rôle |
| --- | --- |
| \`npm run dev\` | Serveur de développement |
| \`npm run build\` | Version optimisée dans \`dist/\` |
| \`germin kanban\` | Ouvre le Kanban relié à \`x/task.json\` |
| \`germin test\` | Lance les tests (projets d'exemple) |
| \`germin deploy\` | Publie sur GitHub Pages (guidé) |

## Mettre en ligne

\`\`\`bash
germin deploy
\`\`\`

Le site sera disponible sur \`https://<ton-pseudo>.github.io/${project_name}/\`.
`,
  GITIGNORE: () => `
node_modules/
dist/
.env
.germin/
  `,
  TASK: () =>
    JSON.stringify(
      [
        {
          id: 1,
          title: 'Créer la structure de la page',
          description: 'Header, main et footer dans index.html',
          label: 'todo',
          time: 0,
        },
        {
          id: 2,
          title: 'Ajouter le CSS global',
          description: 'Couleurs et mise en page dans style.css',
          label: 'in-progress',
          time: 0,
        },
        {
          id: 3,
          title: 'Ajouter une interaction JS',
          description: 'Un événement dans script.js',
          label: 'done',
          time: 0,
        },
      ],
      null,
      2
    ),
  VITE: () => `
const { defineConfig, createLogger } = require('vite');

// Vite avertit que script.js n'est pas « bundlé » : c'est voulu (script classique,
// fonctions globales, onclick possible). On masque cet avertissement pour ne pas inquiéter.
const logger = createLogger();
const warn = logger.warn;
logger.warn = (message, options) => {
  if (message.includes("can't be bundled without")) return;
  warn(message, options);
};

module.exports = defineConfig({
  customLogger: logger,
  // './' est indispensable pour GitHub Pages (site servi dans /nom-du-depot/)
  base: './',
  root: './',
  server: {
    open: true,
    port: 5173,
  },
});
`,
};

module.exports = TEMPLATES;
