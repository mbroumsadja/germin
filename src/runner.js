const fs = require('fs');
const path = require('path');
const vm = require('vm');

class ExerciseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ExerciseError';
  }
}

const TIMEOUT_MS = 1000;

function show(v) {
  if (v === undefined) return 'undefined';
  if (typeof v === 'number') return String(v); // Infinity et NaN restent lisibles
  if (typeof v === 'function') return 'une fonction';
  try {
    const s = JSON.stringify(v);
    return s === undefined ? String(v) : s;
  } catch {
    return String(v);
  }
}

// Valeurs de la VM : comparées par type + représentation JSON (prototypes différents entre « realms »)
const same = (a, b) => typeof a === typeof b && show(a) === show(b);

const TYPE_FR = {
  string: 'du texte',
  number: 'un nombre',
  boolean: 'un booléen (vrai/faux)',
  object: 'un objet ou un tableau',
  undefined: 'rien (undefined)',
  function: 'une fonction',
};

function type_hint(actual, expected) {
  if (actual === undefined)
    return ' → ta fonction ne renvoie rien : as-tu écrit return ?';
  if (typeof actual !== typeof expected) {
    return ` → tu obtiens ${TYPE_FR[typeof actual] || typeof actual} alors qu'on attend ${TYPE_FR[typeof expected] || typeof expected}.`;
  }
  return '';
}

function make_stub() {
  const handler = {
    get: (_t, key) =>
      key === Symbol.toPrimitive ? () => '' : key === 'length' ? 0 : proxy(),
    apply: () => proxy(),
    construct: () => proxy(),
    set: () => true,
  };
  const proxy = () => new Proxy(function () {}, handler);
  return proxy();
}

function load_script(project_path, rel = 'public/js/script.js') {
  const file = path.join(project_path, rel);
  if (!fs.existsSync(file)) {
    throw new ExerciseError(
      `Le fichier ${rel} est introuvable. Crée-le à cet endroit.`
    );
  }
  const code = fs.readFileSync(file, 'utf8');
  const noop = () => {};
  const sandbox = {
    console: { log: noop, warn: noop, error: noop, info: noop },
    document: make_stub(),
    window: make_stub(),
    localStorage: make_stub(),
    alert: noop,
    confirm: () => false,
    prompt: () => null,
    setTimeout: () => 0,
    setInterval: () => 0,
    clearTimeout: noop,
    clearInterval: noop,
    fetch: () =>
      Promise.reject(new Error('réseau désactivé pendant les tests')),
  };
  const ctx = vm.createContext(sandbox);
  try {
    new vm.Script(code, { filename: rel }).runInContext(ctx, {
      timeout: TIMEOUT_MS,
    });
  } catch (e) {
    if (e && e.name === 'SyntaxError') {
      throw new ExerciseError(
        `Erreur de syntaxe dans ${rel} : ${e.message}. Vérifie les accolades { }, les parenthèses ( ) et les guillemets.`
      );
    }
    if (e && e.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT') {
      throw new ExerciseError(
        `${rel} tourne sans jamais s'arrêter (boucle infinie ?).`
      );
    }
    throw new ExerciseError(
      `Ton code plante dès le chargement de ${rel} : ${e && e.name}: ${e && e.message}`
    );
  }
  return {
    existe(name) {
      return vm.runInContext(`typeof ${name}`, ctx) === 'function';
    },
    appeler(name, ...args) {
      if (!/^[A-Za-z_$][\w$]*$/.test(name))
        throw new Error(`Nom de fonction invalide : ${name}`);
      if (vm.runInContext(`typeof ${name}`, ctx) !== 'function') {
        throw new ExerciseError(
          `La fonction \`${name}\` n'existe pas encore dans ${rel}. Crée-la : function ${name}(...) { ... }`
        );
      }
      ctx.__args = args;
      try {
        return vm.runInContext(`${name}(...__args)`, ctx, {
          timeout: TIMEOUT_MS,
        });
      } catch (e) {
        if (e && e.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT') {
          throw new ExerciseError(
            `${name}(${args.map(show).join(', ')}) ne s'arrête jamais (boucle infinie ?).`
          );
        }
        throw new ExerciseError(
          `${name}(${args.map(show).join(', ')}) plante : ${e && e.name}: ${e && e.message}`
        );
      }
    },
  };
}

function make_api(project_path) {
  return {
    lire(rel) {
      const file = path.join(project_path, rel);
      if (!fs.existsSync(file))
        throw new ExerciseError(`Le fichier ${rel} est introuvable.`);
      return fs.readFileSync(file, 'utf8');
    },
    sans_commentaires(html) {
      return html
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\/\*[\s\S]*?\*\//g, '');
    },
    charger: (rel) => load_script(project_path, rel),
    egal(actual, expected, contexte) {
      if (!same(actual, expected)) {
        throw new ExerciseError(
          `${contexte} devrait donner ${show(expected)} mais donne ${show(actual)}${type_hint(actual, expected)}`
        );
      }
    },
    vrai(condition, message) {
      if (!condition) throw new ExerciseError(message);
    },
  };
}

/**
 * Exécute les tests du dossier tests/ d'un projet.
 * @returns {Promise<Array|null>} null s'il n'y a pas de dossier tests/
 */
async function run_tests(project_path, { only } = {}) {
  const dir = path.join(project_path, 'tests');
  if (!fs.existsSync(dir)) return null;
  const results = [];
  for (const name of fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.js'))
    .sort()) {
    const full = path.join(dir, name);
    delete require.cache[require.resolve(full)];
    for (const def of [].concat(require(full))) {
      if (only && def.id !== only) continue;
      const base = {
        id: def.id,
        titre: def.titre,
        indices: def.indices || [],
        fichiers: def.fichiers || [],
      };
      try {
        await def.run(make_api(project_path));
        results.push({ ...base, ok: true });
      } catch (e) {
        const message =
          e && e.name === 'ExerciseError'
            ? e.message
            : `Erreur inattendue : ${e && e.message}`;
        results.push({ ...base, ok: false, message });
      }
    }
  }
  return results;
}

module.exports = { run_tests, ExerciseError, show, same };
