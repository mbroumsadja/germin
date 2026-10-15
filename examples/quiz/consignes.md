# ❓ Projet : Le moteur de quiz

**Niveau 2** — Tu écris la logique d'un quiz : le score, le pourcentage, la mention et le mélange des questions.

## Ce que tu dois faire (`public/js/script.js`)

1. `calculerScore(reponses, bonnesReponses)` → nombre de réponses identiques, position par position
2. `pourcentage(score, total)` → pourcentage arrondi à l'entier (`0` si `total` vaut `0`)
3. `mention(pourcentage)` → `"Excellent"` à partir de 80, `"Bien"` à partir de 50, sinon `"À revoir"`
4. `melanger(tableau)` → **nouveau** tableau avec les mêmes éléments dans un ordre aléatoire (le tableau d'origine ne doit pas changer)

## Comment vérifier

```bash
germin test
```

## Défi bonus

Construis l'interface : affiche une question, des boutons de réponse, puis le score final avec ta mention. Mets-le en ligne avec `germin deploy`.
