# Germin - Générateur de Projets Web Statiques

Germin est un **outil en ligne de commande (CLI)** simple et convivial conçu pour vous aider à **démarrer rapidement de nouveaux projets web statiques**. Il génère un squelette de base avec les fichiers essentiels (HTML, CSS, et optionnellement JavaScript) et intègre des outils pour organiser votre travail dès le début, s'inspirant de la méthodologie Agile.

C'est l'outil idéal pour les **débutants** ou pour tout développeur souhaitant un point de départ propre et organisé pour un projet web statique.

## Fonctionnalités Clés

*   **Structure de Projet Propre :** Crée une arborescence de fichiers logique et organisée, facilitant la gestion de votre projet.
*   **Fichiers Essentiels Personnalisables :** Génère automatiquement :
    *   `index.html` : Votre page principale.
    *   `public/css/style.css` : Pour vos styles CSS.
    *   `public/js/script.js` : (Optionnel) Pour votre code JavaScript.
*   **Organisation des Tâches (Agile) :** Fournit un fichier `TODO.md` contenant des exemples de tâches formulées comme des "User Stories" Agile, vous donnant un cadre pour planifier et suivre votre avancement.
*   **Intégration Git & GitHub :** Permet d'initialiser un dépôt Git local et de vous aider à le configurer pour un dépôt distant sur GitHub (cette étape est optionnelle).
*   **Interface Conviviale :** Utilise une interface en ligne de commande simple avec des messages clairs et un peu d'ASCII art pour une touche unique.

## Installation

### Prérequis :

*   Node.js (version 16 ou supérieure)
*   Git (optionnel, nécessaire si vous souhaitez l'initialisation Git)

### Installation Globale :

Ouvrez votre terminal ou invite de commande et exécutez :
bash
npm install -g germin

Cela installera Germin sur votre système, le rendant accessible depuis n'importe quel répertoire.

## Comment Utiliser Germin ?

L'utilisation de Germin est un processus simple guidé par des questions dans le terminal :

1.  **Lancez Germin :**
    Ouvrez votre terminal dans le répertoire où vous souhaitez créer votre projet (par exemple, votre dossier de développement). Exécutez la commande :

bash
    germin


2.  **Répondez aux Questions :**
    Germin vous posera quelques questions :
    *   Le **nom de votre projet** (par exemple, `mon-super-projet`). Un dossier portant ce nom sera créé.
    *   Si vous souhaitez **inclure un fichier JavaScript** (`script.js`).
    *   Si vous souhaitez **initialiser un dépôt Git** et le configurer pour **GitHub**.

3.  **Naviguez vers le Projet :**
    Une fois la génération terminée, déplacez-vous dans le dossier de votre nouveau projet :

bash
    cd votre-nom-de-projet # Remplacez par le nom que vous avez choisi


4.  **Installez les Dépendances :**
    Le squelette inclut un `package.json` pour gérer les dépendances (comme un serveur de développement simple). Installez-les :

bash
    npm install


5.  **Lancez le Serveur de Développement :**
    Le squelette généré inclut généralement une commande pour démarrer un serveur local afin de prévisualiser votre projet :

bash
    npm dev


6.  **Ouvrez dans le Navigateur :**
    Votre projet est maintenant servi localement. Ouvrez votre navigateur web à l'adresse indiquée dans le terminal (souvent `http://localhost:8080`).

Vous êtes prêt à commencer à développer votre projet en éditant les fichiers `index.html`, `style.css`, et `script.js` !

## Structure du Projet Généré

Voici à quoi ressemblera la structure de votre nouveau projet :

mon-super-projet/
├── index.html          # Votre page principale
├── public/             # Fichiers accessibles publiquement
│   ├── css/
│   │   └── style.css   # Vos styles
│   └── js/
│       └── script.js   # Votre code JS (si sélectionné)
├── package.json        # Configuration du projet et scripts NPM
├── README.md           # Description de votre projet
├── TODO.md             # Tâches et User Stories pour vous guider
└── .gitignore          # Fichiers et dossiers à ignorer par Git

## Contributions

Les contributions sont les bienvenues ! Si vous souhaitez améliorer Germin :

1.  Forkez le dépôt (créez votre propre copie).
2.  Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-super-fonctionnalite`).
3.  Committez vos changements (`git commit -m 'Ajout de ma super fonctionnalité'`).
4.  Poussez vos changements sur votre dépôt fork (`git push origin feature/ma-super-fonctionnalite`).
5.  Ouvrez une Pull Request (demande de fusion) sur le dépôt original.

## Licence

Ce projet est distribué sous la licence MIT. Consultez le fichier `LICENSE` pour plus de détails.

## Ressources Utiles

*   [MDN Web Docs](https://developer.mozilla.org/)
*   [freeCodeCamp](https://www.freecodecamp.org/)
*   [W3Schools](https://www.w3schools.com/)