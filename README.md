```
██████╗ ███████╗██████╗ ███╗   ███╗██╗███╗   ██╗
██╔════╝ ██╔════╝██╔══██╗████╗ ████║██║████╗  ██║
██║  ███╗█████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║
██║   ██║██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║
╚██████╔╝███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║
 ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝
```

Un mini framework CLI pour générer des projets web statiques avec HTML, CSS, JS et une app Trello intégrée pour la gestion des tâches.
Créez des projets web statiques avec HTML, CSS, JS/TypeScript et une app Kanban.

![Version](https://img.shields.io/badge/version-1.0.3-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
[![NPM Version](https://img.shields.io/npm/v/germin.svg)](https://www.npmjs.com/package/germin)

## Table des matières
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Commandes](#commandes)
- [Structure du projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Contribuer](#contribuer)
- [Licence](#licence)

## Installation

Pour installer Germin CLI, vous avez besoin de Node.js et npm (ou yarn) installés sur votre machine.

```bash
npm install -g germin
```

Ou si vous utilisez yarn :

```bash
yarn global add germin
```

## Utilisation

Une fois Germin CLI installé, vous pouvez l'utiliser pour créer et gérer vos projets.

Pour créer un nouveau projet en mode interactif :
```bash
germin create
```

Pour créer un nouveau projet avec un nom spécifique :
```bash
germin create <nom-du-projet>
```
Par exemple :
```bash
germin create mon-super-projet
```

Suivez les instructions à l'écran pour configurer votre projet.

## Commandes

Germin CLI propose les commandes suivantes :

*   `germin create [nom-du-projet]`: Crée un nouveau projet web statique.
    *   Si `nom-du-projet` est fourni, le projet est créé directement avec ce nom.
    *   Sinon, un mode interactif est lancé pour vous guider.
*   `germin build`: Construit le projet pour la production dans le dossier `dist/`.
    *   Cette commande copie les fichiers de `public/` et `index.html` dans `dist/`.
    *   Elle copie également le `README.md` du projet dans `dist/`.
*   `germin deploy`: Déploie le contenu du dossier `dist/` sur GitHub Pages.
    *   Cette commande installe `gh-pages` si nécessaire, exécute `germin build`, puis déploie.

Pour obtenir de l'aide sur une commande spécifique (non implémenté actuellement, mais bonne pratique) :
```bash
germin <commande> --help
```

## Structure du projet

Lorsqu'un nouveau projet est créé avec Germin, il aura la structure de dossiers suivante (exemple pour un projet nommé `mon-projet`) :

```
mon-projet/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── assets/
│       └── (images, polices, etc.)
├── .germin/
│   └── config.json  // Configuration spécifique à Germin pour le projet
├── .gitignore
├── index.html
├── README.md         // README spécifique au projet généré
└── trello_board.md   // Fichier Markdown pour l'application Kanban
```

*   **`public/`**: Contient tous les fichiers statiques (CSS, JavaScript, images, etc.).
*   **`public/css/style.css`**: Fichier CSS principal.
*   **`public/js/main.js`**: Fichier JavaScript principal.
*   **`public/assets/`**: Pour les autres ressources comme les images, polices, etc.
*   **`.germin/config.json`**: Fichier de configuration pour Germin (par exemple, options choisies lors de la création).
*   **`.gitignore`**: Fichier standard pour ignorer les fichiers et dossiers dans Git (ex: `node_modules`, `dist`).
*   **`index.html`**: Fichier HTML principal de votre projet.
*   **`README.md`**: Un README de base pour le projet généré.
*   **`trello_board.md`**: Fichier utilisé par l'application Kanban intégrée pour la gestion des tâches.

## Fonctionnalités

*   **Génération de projet rapide** : Créez une structure de projet de base en quelques secondes.
*   **Mode interactif** : Laissez-vous guider par des questions pour personnaliser votre projet.
*   **Choix de langage pour JavaScript** :
    *   JavaScript pur (ES6+)
    *   TypeScript (avec configuration de base)
*   **Frameworks CSS (optionnel)** :
    *   Bootstrap
    *   Tailwind CSS
*   **Intégration Kanban** : Une application Kanban simple basée sur Markdown (`trello_board.md`) est incluse dans chaque projet pour la gestion des tâches.
*   **Serveur de développement local** : Un serveur Express simple est fourni pour prévisualiser votre projet.
*   **Commandes de build et de déploiement** :
    *   `germin build` : Prépare votre projet pour la production.
    *   `germin deploy` : Déploie facilement votre site statique sur GitHub Pages.
*   **Linters et Formatteurs** :
    *   ESLint pour le linting JavaScript et TypeScript.
    *   Prettier pour le formatage du code.
*   **Tests unitaires** : Structure de base pour les tests avec Jest.

## Contribuer

Les contributions sont les bienvenues ! Si vous souhaitez améliorer Germin CLI, veuillez suivre ces étapes :

1.  Forkez le dépôt sur GitHub.
2.  Clonez votre fork sur votre machine locale :
    ```bash
    git clone https://github.com/VOTRE_NOM_UTILISATEUR/germin.git
    cd germin
    ```
3.  Installez les dépendances du projet :
    ```bash
    npm install
    ```
4.  Créez une nouvelle branche pour votre fonctionnalité ou correction de bug :
    ```bash
    git checkout -b ma-nouvelle-fonctionnalite
    ```
5.  Effectuez vos modifications. Pendant le développement, vous pouvez utiliser les scripts npm suivants :
    *   `npm run dev`: Lance Germin CLI en mode développement pour tester vos modifications localement. Par exemple : `npm run dev create mon-projet-test`.
    *   `npm test`: Exécute la suite de tests avec Jest.
    *   `npm run lint`: Vérifie la qualité du code avec ESLint.
    *   `npm run format`: Formate automatiquement le code avec Prettier.
6.  Commitez vos modifications avec des messages clairs :
    ```bash
    git commit -m "Ajout de telle fonctionnalité"
    ```
7.  Poussez votre branche vers votre fork :
    ```bash
    git push origin ma-nouvelle-fonctionnalite
    ```
8.  Ouvrez une Pull Request sur le dépôt original (`main` branche).

Veuillez vous assurer que votre code respecte les standards de linting (`npm run lint`) et que tous les tests passent (`npm test`).

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

Copyright (c) 2024 MBROUMSADJA EMMANUEL.
