const F = ['public/js/script.js'];
const verifie = (t, fn, cas) => {
  const s = t.charger();
  cas.forEach(([args, attendu]) => t.egal(s.appeler(fn, ...args), attendu, `${fn}(${args.map((a) => JSON.stringify(a)).join(', ')})`));
};

module.exports = [
  {
    id: 'addition', titre: 'addition(a, b) renvoie la somme', fichiers: F,
    indices: [
      'Une fonction peut renvoyer un résultat avec le mot-clé return. Est-ce que ta fonction en utilise un ?',
      "L'opérateur + additionne deux nombres. Écris return suivi de ton calcul.",
      'Exemple sur un autre cas : function double(n) { return n * 2; } — adapte-le avec deux paramètres.',
    ],
    run: (t) => verifie(t, 'addition', [[[2, 3], 5], [[-1, 1], 0], [[0.5, 0.25], 0.75]]),
  },
  {
    id: 'soustraction', titre: 'soustraction(a, b) renvoie a - b', fichiers: F,
    indices: [
      "Regarde comment tu as écrit addition : le principe est le même, seul l'opérateur change.",
      "L'opérateur de la soustraction est -. L'ordre des paramètres compte : a - b n'est pas b - a.",
      'Exemple sur un autre cas : function moitie(n) { return n / 2; }',
    ],
    run: (t) => verifie(t, 'soustraction', [[[5, 3], 2], [[3, 5], -2], [[0, 0], 0]]),
  },
  {
    id: 'multiplication', titre: 'multiplication(a, b) renvoie le produit', fichiers: F,
    indices: [
      'Quel symbole utilise-t-on pour multiplier en JavaScript ?',
      "C'est l'astérisque * . N'oublie pas return.",
      'Exemple sur un autre cas : function carre(n) { return n * n; }',
    ],
    run: (t) => verifie(t, 'multiplication', [[[4, 3], 12], [[0, 99], 0], [[-2, 5], -10]]),
  },
  {
    id: 'division', titre: 'division(a, b) renvoie a / b (null si b vaut 0)', fichiers: F,
    indices: [
      'Que se passe-t-il quand on divise par zéro ? Ta fonction doit gérer ce cas à part.',
      'Utilise une condition if (b === 0) { ... } avant de faire le calcul, et renvoie null dans ce cas.',
      'Exemple sur un autre cas : function racine(n) { if (n < 0) { return null; } return Math.sqrt(n); }',
    ],
    run: (t) => verifie(t, 'division', [[[10, 2], 5], [[1, 4], 0.25], [[5, 0], null], [[0, 5], 0]]),
  },
  {
    id: 'moyenne', titre: 'moyenne(nombres) renvoie la moyenne du tableau', fichiers: F,
    indices: [
      "Pour une moyenne, il faut d'abord la somme de tous les nombres, puis la diviser par leur quantité.",
      'Une boucle for (const n of nombres) { ... } te permet de passer sur chaque nombre. nombres.length donne la quantité.',
      'Exemple sur un autre cas : let total = 0; for (const n of liste) { total += n; } — total contient alors la somme.',
    ],
    run: (t) => verifie(t, 'moyenne', [[[[10, 20, 30]], 20], [[[]], 0], [[[5]], 5], [[[1, 2]], 1.5]]),
  },
];
