# 🌱 Germin

**Le terrain d'entraînement des jeunes développeurs.** On apprend en construisant de vrais petits projets, avec des tests qui valident ce qu'on écrit, un tableau Kanban qui suit la progression, un tuteur IA (Claude) qui guide sans donner la réponse, et une mise en ligne sur GitHub Pages à la fin.

```bash
npm install -g germin
```

Prérequis : Node.js 18 ou plus. Git est nécessaire uniquement pour `germin deploy`.

## Démarrage rapide

```bash
germin exemples              # voir les projets guidés
germin new calculatrice      # créer un projet guidé
cd calculatrice
# lis CONSIGNES.md, puis écris ton code dans public/js/script.js
germin test                  # vérifie ton travail
germin hint                  # un indice si tu es bloqué(e)
germin kanban                # suis ta progression
germin deploy                # mets ton site en ligne
```

## Les commandes

| Commande | Rôle |
| --- | --- |
| `germin create [nom]` | Projet libre (questions : CSS ou Bootstrap, Kanban, git). Options : `--css`, `--no-kanban`, `--no-git`, `-y` |
| `germin exemples` | Liste les projets guidés |
| `germin new <exemple> [dossier]` | Projet guidé : consignes, code de départ, tests, tâches Kanban liées |
| `germin test` | Lance les tests avec des messages pédagogiques, met à jour le Kanban |
| `germin solution` | Copie la solution dans `solution/` après 3 essais de `germin test` |
| `germin kanban` | Ouvre le Kanban sur `http://localhost:3000`, relié à `x/task.json` |
| `germin add` | Ajoute le Kanban à un projet existant |
| `germin hint` | Indice progressif (niveau 1 à 3) sur le premier test en échec |
| `germin explain "<erreur>"` | Explique un message d'erreur en français simple |
| `germin review [fichier]` | Relecture bienveillante, 3 remarques maximum |
| `germin plan "<idée>"` | Découpe une idée en cartes Kanban |
| `germin quiz` | Quiz de 5 questions sur ton projet |
| `germin deploy` | Publie sur GitHub Pages, étape par étape |
| `germin deploy --auto` | Configure un déploiement automatique à chaque `git push` (GitHub Actions) |

`germin complete` reste disponible : c'est un alias de `germin create`.

## Projets guidés

| Exemple | Niveau | Tu apprends |
| --- | --- | --- |
| `page-presentation` | 1 | HTML (titre, paragraphe, image, liste, lien) et CSS de base |
| `calculatrice` | 1 | Fonctions, `return`, conditions, boucles |
| `quiz` | 2 | Tableaux, pourcentages, copie de données |

Chaque projet contient `CONSIGNES.md`, du code de départ, des tests et des tâches Kanban : **une tâche passe en « Terminé » quand son test réussit**. La solution est verrouillée tant que tu n'as pas essayé (3 lancements de `germin test`).

## Le Kanban

`germin kanban` ouvre un tableau (À faire, En cours, Terminé) relié au fichier `x/task.json`, donc versionnable avec git. Glisser-déposer ou boutons ◀ ▶, chronomètre par tâche, avancement, import et export JSON. Ouvert sans serveur, il sauvegarde dans le navigateur.

## Le tuteur IA (optionnel)

Il demande une clé API Anthropic, lue **uniquement** dans la variable d'environnement `ANTHROPIC_API_KEY` :

```bash
# Windows (PowerShell)
$env:ANTHROPIC_API_KEY="ta-clé"
# macOS / Linux
export ANTHROPIC_API_KEY="ta-clé"
```

- Le tuteur est réglé pour **ne jamais donner la solution complète** : `germin hint` va d'une simple question (niveau 1) à un exemple sur un autre cas (niveau 3).
- Sans clé ou sans connexion, `germin hint` donne un **indice hors ligne** et `germin test` fonctionne normalement.
- Ton code n'est envoyé à l'API qu'au moment où tu lances `hint`, `explain`, `review`, `plan` ou `quiz`.
- Ne mets jamais ta clé dans ton projet ni sur GitHub (le `.gitignore` généré exclut `.env`).
- Modèle par défaut : `claude-haiku-5-5` (économique). Pour en changer : variable `GERMIN_MODEL`.

## Mettre en ligne

```bash
germin deploy
```

Germin vérifie git, enregistre ton travail, relie ton dépôt GitHub (ou le crée avec GitHub CLI), construit le site et publie la branche `gh-pages`. Il affiche l'adresse finale `https://<pseudo>.github.io/<projet>/` et les réglages à faire la première fois (Settings → Pages). En cas d'erreur, un conseil adapté s'affiche (authentification, dépôt introuvable, identité git…).

Pour aller plus loin : `germin deploy --auto` ajoute un workflow GitHub Actions et le site se met à jour tout seul à chaque `git push` (Settings → Pages → Source : « GitHub Actions »).

## Structure d'un projet

```
mon-projet/
├── index.html
├── public/ (css/, js/, assets/images/, pages/)
├── x/               Kanban (kanban.html, task.json)
├── tests/           projets guidés uniquement
├── CONSIGNES.md     projets guidés uniquement
├── germin.json      configuration Germin
├── vite.config.js   base './' pour GitHub Pages
└── package.json
```

`x/`, `tests/` et `solution/` ne sont jamais publiés : seul le résultat de `npm run build` (`dist/`) part en ligne.

## Développement

```bash
npm install
npm test        # suite jest
```

Voir [CONTRIBUTING.md](CONTRIBUTING.md). Licence : voir `licence.txt`.
