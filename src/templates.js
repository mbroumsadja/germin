const TEMPLATES = {
  /**
   * Favicon template (base64-encoded PNG).
   * @returns {string} Base64-encoded favicon data.
   */
  favicon: () => 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAADdJREFUWEft1rENAAAMg8B3/pEjN4kO0yEHLsB/Ae4MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIB3AZgXAOE3n5EXAAAAAElFTkSuQmCC',

  /**
   * HTML template for the main index page.
   * @param {string} project_name - The name of the project.
   * @param {boolean} js_type - Whether to include a link to script.js.
   * @param {string} css_framework - The chosen CSS framework (e.g., 'Bootstrap').
   * @param {boolean} include_assets - Whether assets folder is included.
   * @returns {string} The HTML content.
   */
  html: (project_name, js_type, css_framework, include_assets) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project_name}</title>
  ${include_assets ? '<link rel="icon" type="image/png" href="public/assets/images/favicon.png">' : ''}
  ${css_framework === 'Bootstrap' ? '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">' : ''}
  <link rel="stylesheet" href="public/css/style.css">
  <link rel="shortcut icon" href="./public/assets/images/favicon.png" type="image/x-icon">
  ${js_type ? '<script src="public/js/script.js" defer></script>' : ''}
</head>
<body>
  <header>
    <nav>
      <ul>
        <li><a href="#">Accueil</a></li>
        <li><a href="http://127.0.0.1:8080/trello/app">Trello</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <h1>Bienvenue dans ${project_name} !</h1>
    <p>Ceci est votre premier projet web statique.</p>
  </main>
  <footer>
    <p>© 2025 ${project_name}</p>
  </footer>
</body>
</html>
  `,

  /**
   * CSS template for Bootstrap customizations.
   * @param {string} project_name - The name of the project (used in comments).
   * @returns {string} The CSS content.
   */
  css_bootstrap: (project_name) => `
/* Additional Bootstrap styles for ${project_name} */

body {
  background-color: #f8f9fa !important; /* Light gray background */
}

header {
  background-color: #343a40 !important; /* Dark background for header */
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
  color: white !important;
  text-decoration: none;
  padding: 5px 10px;
  transition: color 0.3s ease;
}

nav a:hover {
  color: #adb5bd !important; /* Light gray hover color */
}

main {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
  text-align: center;
  min-height: 54vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

h1, h2, h3 {
  color: #343a40 !important; /* Dark gray for headings */
}

footer {
  text-align: center;
  padding: 15px 0;
  background-color: #e9ecef !important; /* Light gray footer background */
  color: #343a40 !important; /* Dark gray text */
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

  /**
   * CSS template for the main site styles (pure CSS).
   * @param {string} project_name - The name of the project (used in comments).
   * @returns {string} The CSS content.
   */
  css_pur: (project_name) => `
/* Styles for ${project_name} */

:root {
  --primary-color: #333;
  --background-color: #f0f0f0;
  --text-color: #333;
  --footer-bg: #ddd;
}

body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
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
  min-height: 54vh;
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
  padding: 15px 0;
  background-color: var(--footer-bg);
  color: var(--text-color);
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

  /**
   * JavaScript template for the main site script.
   * @param {string} project_name - The name of the project.
   * @returns {string} The JavaScript content.
   */
  js: (project_name) => `
// script.js for ${project_name}
document.addEventListener('DOMContentLoaded', () => {
  console.log('Bienvenue dans ${project_name} ! Le DOM est entièrement chargé et analysé.');

  // Example: Add a simple interaction
  const mainHeading = document.querySelector('main h1');
  if (mainHeading) {
    mainHeading.addEventListener('mouseover', () => {
      mainHeading.style.color = 'blue';
    });
    mainHeading.addEventListener('mouseout', () => {
      mainHeading.style.color = '';
    });
  }
});
  `,

  /**
   * TypeScript template for the main site script.
   * @param {string} project_name - The name of the project.
   * @returns {string} The TypeScript content.
   */
  ts: (project_name) => `
// script.ts for ${project_name}
document.addEventListener('DOMContentLoaded', () => {
  console.log('Bienvenue dans ${project_name} ! Le DOM est entièrement chargé et analysé.');

  // Example: Add a simple interaction using TypeScript syntax
  const mainHeading = document.querySelector('main h1') as HTMLElement | null;
  if (mainHeading) {
    mainHeading.addEventListener('mouseover', () => {
      mainHeading.style.color = 'blue';
    });
    mainHeading.addEventListener('mouseout', () => {
      mainHeading.style.color = '';
    });
  }
});
  `,

  /**
   * HTML template for the Trello main page.
   * @param {string} project_name - The name of the project.
   * @param {string} css_framework - The chosen CSS framework (e.g., 'Bootstrap').
   * @param {boolean} include_assets - Whether assets folder is included.
   * @returns {string} The HTML content.
   */
  trello_page: (project_name, css_framework, include_assets) => `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kanban - ${project_name}</title>
    ${include_assets ? '<link rel="icon" type="image/png" href="/public/assets/images/favicon.png">' : ''}
    ${css_framework === 'Bootstrap' ? '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">' : ''}
    <link rel="stylesheet" href="/public/css/style.css">
    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
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
            border-radius: 8px;
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
            text-align: center;
            padding: 10px;
            margin-top: auto;
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
    </style>
</head>
<body>
    <div class="timer-container">
        <span id="timer">Temps investi : 00:00:00</span>
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
        // Charger les tâches depuis localStorage
        let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || {
            "todo": [],
            "in-progress": [],
            "done": []
        };

        // Initialiser le chronomètre
        let timer = JSON.parse(localStorage.getItem("projectTimer")) || 0;
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
            timerDisplay.textContent = \`Temps investi : \${formatTime(timer)}\`;
            localStorage.setItem("projectTimer", JSON.stringify(timer));
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
            timerDisplay.textContent = \`Temps investi : \${formatTime(timer)}\`;
            localStorage.setItem("projectTimer", JSON.stringify(timer));
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
            timerDisplay.textContent = \`Temps investi : \${formatTime(timer)}\`;
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
            localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
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
                localStorage.removeItem("kanbanTasks");
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

            const taskId = Date.now().toString();
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
                    uploadedTasks.forEach(task => {
                        if (!task.title || !task.description || !task.label) {
                            alert("Chaque tâche doit avoir un titre, une description et une étiquette !");
                            return;
                        }
                        const taskId = (Date.now() + Math.random()).toString();
                        const newTask = { id: taskId, title: task.title, description: task.description, label: task.label };
                        tasks["todo"].push(newTask);
                        const taskElement = createTaskElement(newTask);
                        document.getElementById("todo").appendChild(taskElement);
                    });
                    saveTasks();
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
   * README template.
   * @param {string} project_name - The name of the project.
   * @param {boolean} js_type - Whether JS is included in the main site.
   * @param {string} css_framework - The chosen CSS framework.
   * @param {boolean} include_assets - Whether assets folder is included.
   * @param {boolean} include_pages - Whether pages folder is included.
   * @param {boolean} init_git - Whether Git is initialized.
   * @returns {string} The README content.
   */
  readme: (project_name, js_type, css_framework, include_assets, include_pages, init_git) => `
# ${project_name}

## Bienvenue dans votre projet web statique !

Ce projet a été généré avec **Germin**, un outil CLI pour créer rapidement des projets web statiques avec une structure organisée et une application Kanban pour gérer vos tâches. Ce README vous guide à travers l'installation, l'utilisation et le développement de votre projet.

### Structure du projet

\`\`\`
${project_name}/
├── index.html              # Page principale
├── public/
│   ├── css/
│   │   └── style.css       # Styles CSS ${css_framework === 'Bootstrap' ? '(personnalisations pour Bootstrap)' : ''}
│   ├── js/                 ${js_type ? '# Scripts JavaScript/TypeScript' : '# (Optionnel, non inclus)'}
│   │   └── script.js
│   ├── assets/images/      ${include_assets ? '# Dossier pour images et favicon (ex. favicon.png)' : '# (Optionnel, non inclus)'}
│   ├── pages/              ${include_pages ? '# Dossier pour pages HTML supplémentaires' : '# (Optionnel, non inclus)'}
│   └── trello/
│       ├── app.html        # Application Kanban pour gérer les tâches
│       └── scripts/
│           └── build.js    # Script de construction
├── package.json            # Configuration et scripts NPM
├── README.md               # Ce fichier
${init_git ? '└── .gitignore                # Fichiers à ignorer par Git' : ''}
\`\`\`

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
npm run dev
\`\`\`

- Ouvre votre navigateur à \`http://localhost:8080\` pour voir la page principale.
- Visitez \`http://localhost:8080/trello\` pour accéder à l'application Kanban.

#### Gérer les tâches avec l'application Kanban
- Accédez à \`http://localhost:8080/trello\`.
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
  - Gérez vos tâches dans \`public/trello/app.html\`.
  - Remplacez \`public/assets/images/favicon.png\` par votre propre favicon si nécessaire.

- **Ajouter des ressources** :
  - Placez les images ou autres fichiers dans \`public/assets/images/\` si activé.

### Contribuer

1. Forkez le dépôt.
2. Créez une branche : \`git checkout -b feature/ma-fonctionnalite\`.
3. Commitez vos changements : \`git commit -m 'Ajout de ma fonctionnalité'\`.
4. Poussez vers votre fork : \`git push origin feature/ma-fonctionnalite\`.
5. Ouvrez une Pull Request.

### Licence

Ce projet est sous licence MIT. Voir le fichier \`LICENSE\` pour plus de détails.

---

**Généré avec 💚 par Germin**
  `,

  /**
   * .gitignore template.
   * @returns {string} The gitignore content.
   */
  gitignore: `
# Dependencies
node_modules/

# Build output
dist/

# Logs
*.log

# IDE specific files
.vscode/
.idea/
  `,

  /**
   * Build script template.
   * @param {string} - The name of the project.
   * @returns {string} The build script content.
   */
  scripts: () => `
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

    // Copier le dossier public (css, js, assets, pages, trello)
    await fs.cp(
      path.join(process.cwd(), 'public'),
      path.join(distPath, 'public'),
      { recursive: true }
    );

    // Générer un fichier manifest.json (optionnel, pour PWA)
    const manifest = {
      name: process.env.npm_package_name || 'Mon Projet',
      short_name: process.env.npm_package_name || 'Projet',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#343a40',
      icons: [
        {
          src: '/public/assets/images/favicon.png',
          sizes: '32x32',
          type: 'image/png'
        }
      ]
    };
    await fs.writeFile(
      path.join(distPath, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );

    spinner.succeed('Projet construit avec succès dans dist/.');
  } catch (error) {
    spinner.fail(\`Échec de la construction : \${error.message}\`);
    throw error;
  }
}

build();
  `
};

module.exports = TEMPLATES;