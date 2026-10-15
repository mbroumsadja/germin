const html = (t) => t.sans_commentaires(t.lire('index.html'));
const css = (t) => t.sans_commentaires(t.lire('public/css/style.css'));

module.exports = [
  {
    id: 'titre', titre: 'Un titre h1 avec du texte', fichiers: ['index.html'],
    indices: [
      'Les titres se font avec des balises. Laquelle représente le titre le plus important de la page ?',
      "La balise est h1. Elle s'ouvre avec <h1> et se ferme avec </h1>, ton texte se place entre les deux.",
      'Exemple sur un autre cas : <h2>Mes projets</h2> — ici avec h1 et ton prénom.',
    ],
    run(t) {
      const m = html(t).match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
      t.vrai(m, 'Je ne trouve pas de titre <h1>…</h1> dans index.html.');
      t.vrai(m[1].trim().length > 0, 'Ton <h1> est vide : écris ton prénom entre <h1> et </h1>.');
    },
  },
  {
    id: 'paragraphe', titre: 'Un paragraphe p avec du texte', fichiers: ['index.html'],
    indices: [
      'Quelle balise sert à écrire un paragraphe de texte ?',
      'La balise est p : <p>Mon texte</p>.',
      'Exemple sur un autre cas : <p>Bienvenue sur mon site.</p>',
    ],
    run(t) {
      const m = html(t).match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
      t.vrai(m, 'Je ne trouve pas de paragraphe <p>…</p> dans index.html.');
      t.vrai(m[1].trim().length > 0, 'Ton paragraphe est vide : écris une phrase entre <p> et </p>.');
    },
  },
  {
    id: 'image', titre: 'Une image img avec src et alt', fichiers: ['index.html'],
    indices: [
      "Une image se met avec une balise qui n'a pas de balise fermante. Laquelle ?",
      'La balise est img, avec deux attributs : src (le chemin du fichier) et alt (une description en texte).',
      'Exemple sur un autre cas : <img src="chat.png" alt="Un chat gris">',
    ],
    run(t) {
      const m = html(t).match(/<img\b[^>]*>/i);
      t.vrai(m, 'Je ne trouve pas de balise <img> dans index.html.');
      t.vrai(/\bsrc\s*=\s*"[^"]+"/i.test(m[0]), "Ton <img> n'a pas d'attribut src=\"…\" : il indique quel fichier afficher.");
      t.vrai(/\balt\s*=\s*"[^"]+"/i.test(m[0]), "Ton <img> n'a pas de texte alternatif alt=\"…\" : il décrit l'image pour les personnes qui ne la voient pas.");
    },
  },
  {
    id: 'liste', titre: 'Une liste ul avec au moins 3 éléments li', fichiers: ['index.html'],
    indices: [
      'Une liste à puces se fait avec une balise « conteneur » et des balises pour chaque élément.',
      'Le conteneur est ul, chaque élément est un li : <ul><li>…</li></ul>.',
      "Exemple sur un autre cas : <ul><li>Pain</li><li>Lait</li></ul> — il t'en faut au moins 3.",
    ],
    run(t) {
      const m = html(t).match(/<ul\b[^>]*>([\s\S]*?)<\/ul>/i);
      t.vrai(m, 'Je ne trouve pas de liste <ul>…</ul> dans index.html.');
      const n = (m[1].match(/<li\b[^>]*>\s*\S/gi) || []).length;
      t.vrai(n >= 3, `Ta liste contient ${n} élément(s) rempli(s) : il en faut au moins 3 (<li>…</li>).`);
    },
  },
  {
    id: 'lien', titre: 'Un lien a avec href', fichiers: ['index.html'],
    indices: [
      'Un lien se fait avec une balise dont le nom est une seule lettre.',
      "La balise est a, avec l'attribut href qui contient l'adresse : <a href=\"https://…\">texte</a>.",
      'Exemple sur un autre cas : <a href="https://wikipedia.org">Wikipédia</a>',
    ],
    run(t) {
      const m = html(t).match(/<a\b[^>]*>/i);
      t.vrai(m, 'Je ne trouve pas de lien <a>…</a> dans index.html.');
      t.vrai(/\bhref\s*=\s*"[^"]+"/i.test(m[0]), "Ton lien n'a pas d'attribut href=\"…\" : c'est lui qui contient l'adresse.");
    },
  },
  {
    id: 'couleur', titre: 'Une couleur de fond sur le body (style.css)', fichiers: ['public/css/style.css'],
    indices: [
      'En CSS, on choisit un élément (ici body) puis on règle ses propriétés entre accolades.',
      "La propriété s'appelle background-color. Elle se place dans le bloc body { ... }.",
      'Exemple sur un autre cas : h1 { color: darkgreen; } — ici avec body et background-color.',
    ],
    run(t) {
      const m = css(t).match(/\bbody\s*\{([^}]*)\}/i);
      t.vrai(m, 'Je ne trouve pas de règle body { … } dans public/css/style.css.');
      t.vrai(/background(-color)?\s*:\s*[^;}\s][^;}]*/i.test(m[1]), "Ta règle body n'a pas de background-color : ajoute par exemple background-color: #eef7f1;");
    },
  },
];
