# Germin 🌱 — Générateur de Projets Web Statiques

**Version 1.0.5**

Germin est un outil CLI moderne et rapide pour générer des projets web statiques avec une structure propre, un système de tâches Kanban intégré, et des options de personnalisation via une interface interactive , tout en gérant le déploiement.

---

## ✨ Fonctionnalités

- 📁 Génération d’une arborescence claire (HTML, CSS, JS)
- 🎨 Choix entre CSS pur ou Bootstrap
- ⚙️ Support JavaScript ou 
- 🖼️ Dossiers optionnels : `assets/` (images), `pages/`
- ✅ Application **Kanban** intégrée pour la gestion de tâches (drag & drop, chronomètre, import/export)
- 🐙 Intégration Git + GitHub Pages
- 📦 Scripts intégrés : `dev`, `build`, `deploy`
- 🧑‍💻 Interface CLI ergonomique (animations + couleurs)

---

## 📦 Installation

```bash
npm install -g germin
```

---

## 🚀 Utilisation

### Créer un projet

```bash
germin create mon-projet
```

Répondez aux questions guidées pour choisir :
- Le langage (HTML , HTML/CSS ou HTML/CSS/JS)
- Le framework CSS (cascading style sheet (CSS) ou framework (Bootstrap))
- Le Javascript 
- Les dossiers optionnels (`assets/`, `pages/`)
- L'initialisation Git

Puis :

```bash
cd mon-projet
npm install
npm run dev
```

---

## 🔧 Structure du projet

```
mon-projet/
├── index.html
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   ├── assets
|   |   └── images/
│   ├── pages/
├── x/
│   ├── app.html
│       └── scripts/
│           └── build.js
|       └── task.json
|
├── package.json
├── README.md
├── vite.config.js
├── favicon.ico
└── .gitignore
```

---

## ✅ Application Kanban intégrée

Accessible via : `http://localhost:5173${project_name}`

### Fonctions :
- Ajouter, modifier, supprimer des tâches
- Glisser-déposer entre les colonnes "À faire", "En cours", "Terminé"
- Chronomètre pour suivre le temps investi
- Importer/Exporter les tâches au format JSON

---

## 📥 Format d'importation JSON

Vous pouvez importer un fichier `.json` contenant vos tâches. Ce fichier doit être un **tableau d’objets** avec les clés suivantes :

### 🔑 Clés obligatoires :

- `title` : le titre de la tâche  
- `description` : un résumé de la tâche  
- `label` : le statut (`todo`, `in-progress`, `done`)

### 🧾 Exemple de fichier `taches.json` :

```json
[
  {
    "title": "Développer la navbar",
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
]
```

### Importation :
1. Allez sur `http://localhost:5173${project_name}`
2. Cliquez sur **"Importer JSON"**
3. Sélectionnez votre fichier
4. Les tâches apparaissent dans leurs colonnes respectives

---

## ⚙️ Scripts disponibles

| Script           | Description                                                          |
|------------------|----------------------------------------------------------------------|
| `npm run dev`    | Lance un serveur local (`localhost:5173`)                            |
| `npm run build`  | Génère une version optimisée dans `dist/`                            |
| `npm run deploy` | Déploie le projet sur GitHub Pages                                   |

---

## 🤝 Contribuer

1. Forkez le projet : [GitHub](https://github.com/mbroumsadja/germin)
2. Créez une branche : `git checkout -b feature/ma-fonctionnalite`
3. Committez : `git commit -m "Ajout d'une fonctionnalité"`
4. Poussez : `git push origin feature/ma-fonctionnalite`
5. Ouvrez une Pull Request !

Voir `CONTRIBUTING.md` pour plus de détails.

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier `LICENSE`.

---

## 💬 Support

Pour toute question ou suggestion :

- 📧 Email : [mbroumsadjaa@gmail.com](mailto:mbroumsadjaa@gmail.com)
- 🐛 Ouvrir une issue sur le dépôt GitHub

---

**Créé avec 💚 par l’équipe Germin**
