const TEMPLATES = {
  html: (projectName, includeJs) => `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Projet web statique généré par Germin pour ${projectName}">
    <title>${projectName}</title>
    <link rel="stylesheet" href="public/css/style.css">
    ${includeJs ? '<script src="public/js/script.js" defer></script>' : ''}
  </head>
  <body>
    <header>
      <nav>
        <ul>
          <li><a href="#">Accueil</a></li>
          <li><a href="#">À propos</a></li>
        </ul>
      </nav>
    </header>
    <main>
      <h1>Bienvenue dans ${projectName} !</h1>
      <p>Ceci est votre premier projet web statique. Modifiez ce texte pour commencer !</p>
    </main>
    <footer>
      <p>© 2025 ${projectName}</p>
    </footer>
  </body>
  </html>
    `,
  css: (projectName) => `
  /* Styles de base pour ${projectName} */
  :root {
    --primary-color: #333;
    --background-color: #f0f0f0;
  }
  
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: var(--background-color);
  }
  
  header nav {
    background-color: var(--primary-color);
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
    color: var(--primary-color);
  }
  
  footer {
    text-align: center;
    padding: 10px;
    background-color: #ddd;
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  
  @media (max-width: 600px) {
    nav ul {
      flex-direction: column;
      align-items: center;
    }
  }
    `,
  js: (projectName) => `
  // Script JavaScript pour ${projectName}
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Bienvenue dans ${projectName} !');
    // Exemple : Ajouter un bouton interactif
    const button = document.createElement('button');
    button.textContent = 'Cliquez-moi';
    button.addEventListener('click', () => alert('Bonjour !'));
    document.querySelector('main').appendChild(button);
  });
    `,
  readme: (projectName, includeJs) => `
  # ${projectName}
  
  ![Node.js](https://img.shields.io/badge/Node.js-v16+-green)
  
  Bienvenue dans votre premier projet web statique généré par Germin !
  
  ## Structure
  - \`index.html\` : Page principale avec une navbar, une section principale et un footer.
  - \`public/\` : Contient les fichiers statiques.
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
     npm dev
     \`\`\`
  4. Ouvrez http://localhost:8080 dans votre navigateur.
  
  ## Prochaines étapes
  - Modifiez \`index.html\` pour ajouter du contenu (ex. : images, texte).
  - Personnalisez \`public/css/style.css\` pour changer l'apparence (ex. : couleurs, polices).
  ${includeJs ? '- Ajoutez des interactions dans `public/js/script.js` (ex. : boutons cliquables).' : ''}
  - Consultez \`TODO.md\` pour des idées de tâches organisées selon la méthodologie Agile.
  
  ## Ressources
  - [MDN Web Docs](https://developer.mozilla.org) : Documentation HTML, CSS, JS.
  - [freeCodeCamp](https://www.freecodecamp.org) : Tutoriels gratuits.
  - [W3Schools](https://www.w3schools.com) : Exemples pratiques.
    `,
  todo: (projectName, includeJs) => `
  # TODO - ${projectName}
  
  Tâches pour développer votre projet web statique, organisées selon la méthodologie Agile. Cochez les tâches terminées avec [x].
  
  ## User Stories
  
  ### 1. Bouton Interactif (Priorité : Haute)
  En tant que visiteur, je veux cliquer sur un bouton pour voir une interaction.
  - [ ] Ajouter un bouton "Cliquez-moi" dans \`index.html\` (HTML).
  - [ ] Styliser le bouton (ex. : fond bleu, texte blanc) dans \`public/css/style.css\` (CSS).
  ${includeJs ? '- [ ] Afficher une alerte "Bonjour !" au clic dans `public/js/script.js` (JavaScript).' : ''}
  
  ### 2. Liste de Contenu (Priorité : Moyenne)
  En tant que visiteur, je veux voir une liste pour naviguer facilement.
  - [ ] Créer une liste \`<ul>\` avec 3 éléments dans \`index.html\` (HTML).
  - [ ] Centrer la liste dans \`public/css/style.css\` (CSS).
  
  ### 3. Image Attrayante (Priorité : Basse)
  En tant que visiteur, je veux voir une image pour rendre le site attrayant.
  - [ ] Ajouter une image dans \`public/\` et l’afficher dans \`index.html\` (HTML).
  - [ ] Styliser l’image (ex. : max-width: 100%) dans \`public/css/style.css\` (CSS).
  
  ## Comment utiliser
  - **Priorisez** : Commencez par les tâches de priorité haute.
  - **Cochez** : Marquez les tâches terminées avec [x] dans ce fichier.
  - **Ajoutez** : Notez vos propres tâches ci-dessous pour personnaliser le projet.
  
  ## Ressources
  - [MDN Web Docs](https://developer.mozilla.org)
  - [freeCodeCamp](https://www.freecodecamp.org)
  - [W3Schools](https://www.w3schools.com)
    `,
  gitignore: `node_modules\n`,
};

module.exports = TEMPLATES;
