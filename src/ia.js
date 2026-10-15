const DEFAULT_MODEL = 'claude-haiku-5-5';
const DEFAULT_BASE_URL = 'https://api.anthropic.com';
const TIMEOUT_MS = 30000;

class IaError extends Error {
  constructor(message, { offline = false } = {}) {
    super(message);
    this.name = 'IaError';
    this.offline = offline;
  }
}

/** La clé n'est lue que dans l'environnement : jamais écrite dans un projet. */
function get_config(env = process.env) {
  return {
    api_key: env.ANTHROPIC_API_KEY || '',
    base_url: (env.ANTHROPIC_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, ''),
    model: env.GERMIN_MODEL || DEFAULT_MODEL,
  };
}

function missing_key_message() {
  return [
    'Le tuteur IA est optionnel : il demande une clé API Anthropic.',
    '  1. Crée une clé sur https://console.anthropic.com',
    '  2. Définis-la dans ton terminal :',
    '       Windows (PowerShell) : $env:ANTHROPIC_API_KEY="ta-clé"',
    '       macOS / Linux        : export ANTHROPIC_API_KEY="ta-clé"',
    "Ne l'écris jamais dans ton projet et ne la publie jamais sur GitHub.",
    'Sans clé, « germin test » et les indices hors ligne continuent de fonctionner.',
  ].join('\n');
}

async function ask_claude({
  system,
  prompt,
  max_tokens = 700,
  config = get_config(),
  fetch_impl = fetch,
}) {
  if (!config.api_key) throw new IaError(missing_key_message());
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res;
  try {
    res = await fetch_impl(`${config.base_url}/v1/messages`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': config.api_key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens,
        system,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    });
  } catch (error) {
    throw new IaError(
      "Impossible de joindre l'API (es-tu connecté à Internet ?).",
      { offline: true }
    );
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new IaError(
        'Clé API refusée : vérifie la variable ANTHROPIC_API_KEY.'
      );
    }
    if (res.status === 429)
      throw new IaError('Trop de demandes : attends un peu puis réessaie.');
    if (res.status >= 500)
      throw new IaError(
        'Le service est momentanément indisponible : réessaie dans un instant.',
        { offline: true }
      );
    let detail = '';
    try {
      detail = (await res.json()).error?.message || '';
    } catch {
      /* corps illisible */
    }
    throw new IaError(`Erreur de l'API (${res.status}) ${detail}`.trim());
  }
  const data = await res.json();
  const text = (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();
  if (!text) throw new IaError("L'API a renvoyé une réponse vide.");
  return text;
}

/** Extrait le premier bloc JSON (objet ou tableau) d'un texte, même entouré de balises. */
function extract_json(text, open) {
  const close = open === '[' ? ']' : '}';
  const start = text.indexOf(open);
  const end = text.lastIndexOf(close);
  if (start === -1 || end <= start)
    throw new IaError("La réponse de l'IA n'est pas exploitable : réessaie.");
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    throw new IaError("La réponse de l'IA n'est pas exploitable : réessaie.");
  }
}

module.exports = {
  ask_claude,
  get_config,
  extract_json,
  missing_key_message,
  IaError,
  DEFAULT_MODEL,
};
