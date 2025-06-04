const TEMPLATES = {
  HTML: (project_name) =>
    `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project_name}</title>
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
</body>
</html>
  `,

  HTML_CSS: (project_name) =>
    `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project_name}</title>
  <link rel="stylesheet" href="public/css/style.css">
  <meta name="theme-color" content="#000"/>
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
</body>
</html>`,
  BOOTSTRAP: () => '/* Bootstrap CSS CDN */',
  HTML_CSS_JS: (project_name) =>
    `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project_name}</title>
  <link rel="stylesheet" href="public/css/style.css">
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
  <script src="./public/js/script.js" defer></script>
</body>
</html>
  `,
  HTML_BOOTSTRAP: (project_name) =>
    `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project_name}</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="public/css/style.css">
  <meta name="theme-color" content="#000" />
  <style>
    :root {
      --bs-primary: #333;
      --bs-light:rgba(6, 54, 32, 0.863);
    }
    body {
      background-color: var(--bs-light);
      font-family: 'Arial', sans-serif;
    }
    .navbar-custom {
      background-color: var(--bs-primary) !important;
    }
    .main-content {
      min-height: calc(100vh - 140px);
    }
    .footer-custom {
      background-color: #ddd;
    }
  </style>
</head>
<body class="d-flex flex-column min-vh-100">
  <!-- Header avec Bootstrap Navbar -->
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark navbar-custom">
      <div class="container">
        <div class="navbar-nav mx-auto">
          <a class="nav-link text-white me-4" href="#">Accueil</a>
          <a class="nav-link text-white" href="#">About</a>
        </div>
      </div>
    </nav>
  </header>
  <!-- Main Content -->
  <main class="flex-grow-1 d-flex align-items-center justify-content-center main-content">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8 text-center">
          <h1 class="display-4 fw-bold text-dark mb-4">Bienvenue dans ${project_name} Bootstrap !</h1>
          <p class="lead text-muted">Ceci est votre premier projet web statique avec Bootstrap.</p>
        </div>
      </div>
    </div>
  </main>
  <!-- Footer -->
  <footer class="footer-custom py-3 mt-auto">
    <div class="container">
      <div class="row">
        <div class="col text-center">
          <p class="mb-0 text-muted">${new Date().getFullYear()} ${project_name} Bootstrap</p>
        </div>
      </div>
    </div>
  </footer>
  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`,
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
# ${project_name}

## Bienvenue dans votre projet web statique !

Ce projet a été généré avec **Germin**, un outil CLI pour créer rapidement des projets web statiques avec une structure organisée et une application Kanban pour gérer vos tâches. Ce README vous guide à travers l'installation, l'utilisation et le développement de votre projet.

### Prérequis

- **Node.js** (version 16 ou supérieure) : [Télécharger](https://nodejs.org)
- **Git** (optionnel, pour la gestion de version) : [Télécharger](https://git-scm.com)

### Installation

1. **Naviguez dans le dossier du projet** :
   \`\`\`bash
   cd ${project_name}
   \`\`\`

2. **Installez les dépendances** :
   \`\`\`bash
   npm install
   \`\`\`

### Utilisation

#### Lancer le serveur de développement
Pour prévisualiser votre projet localement :

\`\`\`bash
npm run start
\`\`\`

- Ouvre votre navigateur à \`http://localhost:3000\` pour voir la page principale.
- Visitez \`http://localhost:3000/x/app\` pour accéder à l'application Kanban.

#### Gérer les tâches avec l'application Kanban
- Accédez à \`http://localhost:3000/x/app\`.
- **Ajoutez des tâches** : Remplissez le formulaire avec un titre, une description et une priorité (Urgent/Normal).
- **Déplacez les tâches** : Glissez-déposez les tâches entre les colonnes "À faire", "En cours" et "Terminé".
- **Suivez le temps investi** : Utilisez le chronomètre pour mesurer le temps passé sur le projet.
- **Importez/Exportez** : Importez des tâches via un fichier JSON ou réinitialisez toutes les tâches.

#### Construire le projet pour la production
Pour générer une version optimisée du projet :

\`\`\`bash
npm run build
\`\`\`

Les fichiers seront générés dans le dossier \`dist/\`, prêts pour le déploiement.

#### Déployer sur GitHub Pages
Si vous avez initialisé Git et configuré un dépôt GitHub :

\`\`\`bash
npm run deploy
\`\`\`

Votre projet sera déployé sur GitHub Pages.

### Développement

- **Éditer les fichiers** :
  - Modifiez \`index.html\` pour le contenu principal.
  - Personnalisez \`public/css/style.css\` pour les styles.
  - Ajoutez du code dans \`public/js/script.js\` pour les interactions dynamiques.
  - Créez des pages supplémentaires dans \`public/pages/\` si activé.
  - Gérez vos tâches dans \`x/app.html\`.

- **Ajouter des ressources** :
  - Placez les images ou autres fichiers dans \`public/assets/images/\` si activé.

**Généré avec 💚 par Germin**
  `,

  GITIGNORE: () => `
node_modules/
package-lock.json
dist/
  `,
  /**
   * HTML template for the Trello main page.
   * @param {string} project_name - The name of the project.
   * @returns {string} The HTML content.
   */
  APP: (project_name) => `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Kanban - ${project_name}</title>
    
     <link rel="stylesheet" href="/public/css/style.css">
  <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background-color:rgba(6, 54, 32, 0.863);
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        h1 {
            text-align: center;
            margin: 20px 0;
            font-size: 2.5em;
        }
        .task-form {
            text-align: center;
            margin-bottom: 20px;
        }
        .task-form input, .task-form select, .task-form button {
            padding: 8px;
            margin: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .task-form button {
            background-color: #4CAF50;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .task-form button:hover {
            background-color: #45a049;
        }
        .task-form .reset-btn {
            background-color: #f44336;
        }
        .task-form .reset-btn:hover {
            background-color: #da190b;
        }
        .kanban-board {
            display: flex;
            justify-content: space-around;
            padding: 20px;
            flex: 1;
        }
        .column {
            background-color: #e0e0e0;
            border-radius: 20px;
            width: 30%;
            padding: 10px;
            min-height: 300px;
        }
        .column h2 {
            text-align: center;
            margin-bottom: 10px;
            font-size: 1.2em;
            color: #333;
        }
        .task {
            background-color: #2e2e2e;
            color: white;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 10px;
            cursor: move;
            border: 1px solid #444;
            position: relative;
            transition: transform 0.2s;
        }
        .task.dragging {
            opacity: 0.5;
            transform: scale(1);
        }
        .delete-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            background: none;
            border: none;
            color: #ff4444;
            cursor: pointer;
            font-size: 1.2em;
            padding: 0;
        }
        .delete-btn:hover {
            color: #ff0000;
        }
        .label {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 5px;
            font-size: 0.8em;
            color: white;
            margin-bottom: 5px;
        }
        .label.urgent {
            background-color: #e74c3c;
        }
        .label.normal {
            background-color: #3498db;
        }
        .task h3 {
            margin: 5px 0;
            font-size: 1em;
            padding: 5px;
            border-radius:5px ;
            background-color: #ddd;
            color:black;
        }
        .task p {
            margin: 5px 0;
            font-size: 0.9em;
            color: #ccc;
        }
        .timer-container {
            text-align: center;
            margin: 10px 0;
        }
        .timer-container span {
            font-size: 1.2em;
            margin-right: 10px;
        }
        .timer-container button {
            padding: 8px 16px;
            margin: 5px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .timer-container .start-btn {
            background-color: #4CAF50;
            color: white;
        }
        .timer-container .start-btn:hover {
            background-color: #45a049;
        }
        .timer-container .stop-btn {
            background-color: #f0ad4e;
            color: white;
        }
        .timer-container .stop-btn:hover {
            background-color: #ec971f;
        }
        .timer-container .reset-btn {
            background-color: #f44336;
            color: white;
        }
        .timer-container .reset-btn:hover {
            background-color: #da190b;
        }
        footer {
            background-color: #ddd;
            display:flex;
            justify-content:center;
            align-items: center;
            width:100%;
            height:3vh;
        }
        @media (max-width: 768px) {
            .kanban-board {
                flex-direction: column;
                align-items: center;
            }
            .column {
                width: 90%;
                margin-bottom: 20px;
            }
        }
          #timer{
          font-size: 30px;
          font-weight:bold;
          color: rgb(221, 221, 221);
        }
    </style>
  </head>
  <body>
     <div class="timer-container">
        <span id="timer">00:00:00</span>
        <button class="start-btn" onclick="startTimer()">Démarrer</button>
        <button class="stop-btn" onclick="stopTimer()">Arrêter</button>
        <button class="reset-btn" onclick="resetTimer()">Réinitialiser</button>
     </div>
     <div class="task-form">
        <input type="text" id="task-title" placeholder="Titre de la tâche" required>
        <input type="text" id="task-desc" placeholder="Description" required>
        <select id="task-label">
          <option value="urgent">Urgent</option>
          <option value="normal">Normal</option>
        </select>
        <button onclick="addTask()">Ajouter une tâche</button>
        <input type="file" id="json-upload" accept=".json" onchange="uploadTasks()">
        <button class="reset-btn" onclick="resetTasks()">Réinitialiser</button>
     </div>
     <div class="kanban-board">
        <div class="column" id="todo" ondragover="allowDrop(event)" ondrop="drop(event, 'todo')">
          <h2>À faire</h2>
        </div>
        <div class="column" id="in-progress" ondragover="allowDrop(event)" ondrop="drop(event, 'in-progress')">
          <h2>En cours</h2>
        </div>
        <div class="column" id="done" ondragover="allowDrop(event)" ondrop="drop(event, 'done')">
          <h2>Terminé</h2>
        </div>
     </div>
     <footer>
        <p>© 2025 ${project_name}</p>
     </footer>
     <script>
        // Utiliser une clé unique pour chaque projet dans le cache
        const PROJECT_KEY = "kanbanTasks_${project_name.replace(/[^a-zA-Z0-9]/g, '_')}";
        const TIMER_KEY = "projectTimer_${project_name.replace(/[^a-zA-Z0-9]/g, '_')}";

        // Charger les tâches depuis localStorage pour ce projet
        let tasks = JSON.parse(localStorage.getItem(PROJECT_KEY)) || {
          "todo": [],
          "in-progress": [],
          "done": []
        };

        // Initialiser le chronomètre
        let timer = JSON.parse(localStorage.getItem(TIMER_KEY)) || 0;
        let timerInterval = null;
        const timerDisplay = document.getElementById("timer");

        function formatTime(seconds) {
          const hrs = Math.floor(seconds / 3600).toString().padStart(2, "0");
          const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
          const secs = (seconds % 60).toString().padStart(2, "0");
          return \`\${hrs}:\${mins}:\${secs}\`;
        }

        function updateTimer() {
          timer++;
          timerDisplay.textContent = \`\${formatTime(timer)}\`;
          localStorage.setItem(TIMER_KEY, JSON.stringify(timer));
        }

        function startTimer() {
          if (!timerInterval) {
             timerInterval = setInterval(updateTimer, 1000);
          }
        }

        function stopTimer() {
          clearInterval(timerInterval);
          timerInterval = null;
        }

        function resetTimer() {
          stopTimer();
          timer = 0;
          timerDisplay.textContent = \`\${formatTime(timer)}\`;
          localStorage.setItem(TIMER_KEY, JSON.stringify(timer));
        }

        // Charger les tâches
        function loadTasks() {
          ["todo", "in-progress", "done"].forEach(columnId => {
             const column = document.getElementById(columnId);
             column.innerHTML = \`<h2>\${columnId === "todo" ? "À faire" : columnId === "in-progress" ? "En cours" : "Terminé"}</h2>\`;
             tasks[columnId].forEach(task => {
                const taskElement = createTaskElement(task);
                column.appendChild(taskElement);
             });
          });
          timerDisplay.textContent = \`\${formatTime(timer)}\`;
        }

        function createTaskElement(task) {
          const taskElement = document.createElement("div");
          taskElement.className = "task";
          taskElement.setAttribute("draggable", "true");
          taskElement.setAttribute("data-id", task.id);
          taskElement.innerHTML = \`
             <div class="label \${task.label}">\${task.label.charAt(0).toUpperCase() + task.label.slice(1)}</div>
             <h3>\${task.title}</h3>
             <p>\${task.description}</p>
             <button class="delete-btn" onclick="deleteTask(this, '\${task.id}')">×</button>
          \`;
          taskElement.addEventListener("dragstart", drag);
          return taskElement;
        }

        function saveTasks() {
          tasks = {
             "todo": [],
             "in-progress": [],
             "done": []
          };
          ["todo", "in-progress", "done"].forEach(columnId => {
             const column = document.getElementById(columnId);
             const taskElements = column.querySelectorAll(".task");
             taskElements.forEach(taskElement => {
                const label = taskElement.querySelector(".label").textContent.toLowerCase();
                const title = taskElement.querySelector("h3").textContent;
                const description = taskElement.querySelector("p").textContent;
                const id = taskElement.getAttribute("data-id");
                tasks[columnId].push({ id, title, description, label });
             });
          });
          localStorage.setItem(PROJECT_KEY, JSON.stringify(tasks));
        }

        function deleteTask(button, taskId) {
          if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
             button.parentElement.remove();
             ["todo", "in-progress", "done"].forEach(columnId => {
                tasks[columnId] = tasks[columnId].filter(task => task.id !== taskId);
             });
             saveTasks();
          }
        }

        function resetTasks() {
          if (confirm("Êtes-vous sûr de vouloir réinitialiser toutes les tâches ? Cette action est irréversible.")) {
             localStorage.removeItem(PROJECT_KEY);
             tasks = { "todo": [], "in-progress": [], "done": [] };
             loadTasks();
          }
        }

        function drag(event) {
          event.dataTransfer.setData("text/plain", event.target.getAttribute("data-id"));
          event.target.classList.add("dragging");
          setTimeout(() => {
             event.target.style.display = "none";
          }, 0);
        }

        function allowDrop(event) {
          event.preventDefault();
        }

        function drop(event, columnId) {
          event.preventDefault();
          const taskId = event.dataTransfer.getData("text/plain");
          const draggedElement = document.querySelector(\`.task[data-id="\${taskId}"]\`);
          if (draggedElement && event.target.classList.contains("column")) {
             draggedElement.style.display = "";
             draggedElement.classList.remove("dragging");
             event.target.appendChild(draggedElement);
             saveTasks();
          }
        }

        function addTask() {
          const title = document.getElementById("task-title").value.trim();
          const desc = document.getElementById("task-desc").value.trim();
          const label = document.getElementById("task-label").value;

          if (!title || !desc) {
             alert("Veuillez remplir tous les champs !");
             return;
          }

          // Vérifier l'unicité de la tâche (titre + description)
          const isDuplicate = Object.values(tasks).some(column =>
             column.some(task => task.title === title && task.description === desc)
          );
          if (isDuplicate) {
             alert("Une tâche avec ce titre et cette description existe déjà !");
             return;
          }

          const taskId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
          const task = { id: taskId, title, description: desc, label };
          tasks["todo"].push(task);
          const taskElement = createTaskElement(task);
          document.getElementById("todo").appendChild(taskElement);
          saveTasks();
          document.getElementById("task-title").value = "";
          document.getElementById("task-desc").value = "";
        }

        function uploadTasks() {
          const fileInput = document.getElementById("json-upload");
          const file = fileInput.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = function(event) {
             try {
                const uploadedTasks = JSON.parse(event.target.result);
                if (!Array.isArray(uploadedTasks)) {
                  alert("Le fichier JSON doit contenir un tableau de tâches !");
                  return;
                }
                let added = 0;
                uploadedTasks.forEach(task => {
                  if (!task.title || !task.description || !task.label) {
                     return;
                  }
                  // Vérifier l'unicité de la tâche (titre + description)
                  const isDuplicate = Object.values(tasks).some(column =>
                     column.some(t => t.title === task.title && t.description === task.description)
                  );
                  if (!isDuplicate) {
                     const taskId = (Date.now() + Math.random()).toString();
                     const newTask = { id: taskId, title: task.title, description: task.description, label: task.label };
                     tasks["todo"].push(newTask);
                     const taskElement = createTaskElement(newTask);
                     document.getElementById("todo").appendChild(taskElement);
                     added++;
                  }
                });
                saveTasks();
                if (added === 0) {
                  alert("Aucune nouvelle tâche ajoutée (toutes étaient déjà présentes ou invalides).");
                }
             } catch (e) {
                alert("Erreur lors de la lecture du fichier JSON : format invalide !");
             }
          };
          reader.readAsText(file);
          fileInput.value = "";
        }

        window.onload = loadTasks;
     </script>
  </body>
  </html>
    `,
  /**
   * Build script template.
   * @param {string} - The name of the project.
   * @returns {string} The build script content.
   */
  SCRIPT: () => `
const fs = require('fs').promises;
const path = require('path');
const ora = require('ora');

async function build() {
  const spinner = ora('Construction du projet pour la production...').start();
  const distPath = path.join(process.cwd(), 'dist');

  try {
    // Supprimer le dossier dist s'il existe
    await fs.rm(distPath, { recursive: true, force: true });
    await fs.mkdir(distPath, { recursive: true });

    // Copier les fichiers principaux
    await fs.copyFile(
      path.join(process.cwd(), 'index.html'),
      path.join(distPath, 'index.html')
    );

    await fs.copyFile(
      path.join(process.cwd(), 'README.md'),
      path.join(distPath, 'README.md')
    );
 const exist = await fs
      .access(path.join(process.cwd(), "favicon.ico"))
      .then(() => true)
      .catch(() => false);
    if (exist) {
      await fs.copyFile(
        path.join(process.cwd(), "favicon.ico"),
        path.join(distPath, "favicon.ico")
      );
    }

    const exists = await fs
      .access(path.join(process.cwd(), 'public'))
      .then(() => true)
      .catch(() => false);
    if (exists) {
      // Copier le dossier public (css, js, assets, pages, trello)
      await fs.cp(
        path.join(process.cwd(), 'public'),
        path.join(distPath, 'public'),
        { recursive: true }
      );
    }
      
    spinner.succeed('Projet construit avec succès dans dist/.');
  } catch (error) {
    spinner.fail(\`Échec de la construction : \${error.message}\`);
    throw error;
  }
}

build();
  `,
  DEPLOY: () => `
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const fs = require('fs').promises;
const path = require('path');

async function deploy() {
  const dist_path = path.join(process.cwd(), 'dist');

  // Vérifier si le dossier dist existe
  try {
    const stat = await fs.stat(dist_path);
    if (!stat.isDirectory()) {
      console.error('Le chemin dist/ existe mais ce nest pas un dossier.');
      process.exit(1);
    }
  } catch (err) {
    console.error('Le dossier dist/ n existe pas. Veuillez le générer avant de déployer.',err);
    process.exit(1);
  }

  // Récupérer l'URL du dépôt distant
  const { stdout: remoteUrl } = await execAsync('git config --get remote.origin.url');

  let match = remoteUrl.trim().match(/github\\.com[:\\/](.+?)\\/(.+?)(\\.git)?$/);
  let siteUrl = '';
  if (match) {
    const user = match[1];
    const repo = match[2].replace(/.git$/, '');
    siteUrl = \`https://\${user}.github.io/\${repo}/\`;
  }
  // Déployer avec gh-pages
  await execAsync('gh-pages -d dist');

  console.log('Déploiement terminé !');
  if (siteUrl) console.log(\`lien vers votre site web : \${siteUrl}\`);
}
deploy();
  `,
  TASK: () =>
    `[
  {
    "title": "Développer la navbar de",
    "description": "Navigation responsive",
    "label": "todo"
  },
  {
    "title": "Ajouter le CSS global",
    "description": "Fichier style.css",
    "label": "in-progress"
  },
  {
    "title": "Corriger les bugs JS",
    "description": "Script de gestion du formulaire",
    "label": "done"
  }
]`,
  VITE: () => `
const { defineConfig } = require('vite');

module.exports = defineConfig({
  root: './',
  server: {
    open: true,
    port: 5173,
  },
});
`,
};

module.exports = TEMPLATES;
