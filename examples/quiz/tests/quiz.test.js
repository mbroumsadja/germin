const F = ['public/js/script.js'];
const verifie = (t, fn, cas) => {
  const s = t.charger();
  cas.forEach(([args, attendu]) => t.egal(s.appeler(fn, ...args), attendu, `${fn}(${args.map((a) => JSON.stringify(a)).join(', ')})`));
};

module.exports = [
  {
    id: 'calculerScore', titre: 'calculerScore compte les bonnes réponses', fichiers: F,
    indices: [
      "Il faut parcourir les deux tableaux en même temps. Quel outil permet d'utiliser la position (l'indice) d'un élément ?",
      'Une boucle for (let i = 0; i < reponses.length; i++) te donne la position i. Compare reponses[i] et bonnesReponses[i], et augmente un compteur quand ils sont égaux.',
      'Exemple sur un autre cas : let n = 0; for (let i = 0; i < a.length; i++) { if (a[i] > 10) { n++; } } — adapte la condition.',
    ],
    run: (t) => verifie(t, 'calculerScore', [[[['a', 'b', 'c'], ['a', 'x', 'c']], 2], [[[], []], 0], [[['a'], ['a', 'b']], 1], [[['a', 'b'], ['a', 'b']], 2]]),
  },
  {
    id: 'pourcentage', titre: 'pourcentage(score, total) arrondi, 0 si total = 0', fichiers: F,
    indices: [
      "Le pourcentage, c'est score divisé par total, multiplié par 100. Et si total vaut 0 ?",
      "Teste d'abord if (total === 0) { return 0; }. Pour arrondir à l'entier, regarde Math.round().",
      'Exemple sur un autre cas : Math.round(2.6) donne 3.',
    ],
    run: (t) => verifie(t, 'pourcentage', [[[3, 4], 75], [[1, 3], 33], [[0, 0], 0], [[5, 5], 100]]),
  },
  {
    id: 'mention', titre: 'mention(p) : Excellent, Bien ou À revoir', fichiers: F,
    indices: [
      "Il y a 3 cas possibles : une condition if ne suffit pas, il t'en faut plusieurs à la suite.",
      "Teste le plus grand seuil d'abord : if (p >= 80) … puis if (p >= 50) … et enfin le cas par défaut.",
      'Exemple sur un autre cas : if (age >= 18) { return "majeur"; } return "mineur";',
    ],
    run: (t) => verifie(t, 'mention', [[[100], 'Excellent'], [[80], 'Excellent'], [[79], 'Bien'], [[50], 'Bien'], [[49], 'À revoir'], [[0], 'À revoir']]),
  },
  {
    id: 'melanger', titre: 'melanger(tableau) renvoie un nouveau tableau mélangé', fichiers: F,
    indices: [
      "Attention : si tu modifies directement le tableau reçu, tu changes aussi celui de l'appelant. Comment travailler sur une copie ?",
      'Fais une copie avec [...tableau], puis parcours-la à l\'envers et échange chaque élément avec un autre pris au hasard (Math.random()).',
      "Exemple sur un autre cas : const copie = [...liste]; copie.push(4); — liste n'a pas changé.",
    ],
    run(t) {
      const s = t.charger();
      const original = [1, 2, 3, 4, 5, 6, 7, 8];
      const entree = [...original];
      const sortie = s.appeler('melanger', entree);
      t.vrai(Array.isArray(sortie), 'melanger doit renvoyer un tableau (as-tu écrit return ?).');
      t.vrai(sortie !== entree, "melanger renvoie le MÊME tableau : fais une copie ([...tableau]) pour ne pas modifier celui d'origine.");
      t.egal(entree, original, 'Le tableau passé à melanger');
      t.egal([...sortie].sort((a, b) => a - b), original, 'Les éléments renvoyés (triés)');
    },
  },
];
