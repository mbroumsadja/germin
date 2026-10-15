const express = require('express');
const path = require('path');
const { read_tasks, write_tasks } = require('./tasks');

function create_kanban_app(project_path) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));

  app.get('/', (req, res) => {
    res.sendFile(path.join(project_path, 'x', 'kanban.html'));
  });

  app.get('/api/tasks', (req, res) => {
    try {
      res.json(read_tasks(project_path));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/tasks', (req, res) => {
    try {
      res.json(write_tasks(project_path, req.body));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return app;
}

/**
 * Démarre le serveur du Kanban (127.0.0.1 uniquement). Essaie les ports
 * suivants si le port demandé est occupé.
 */
function start_kanban(project_path, port = 3000, attempts = 5) {
  const app = create_kanban_app(project_path);
  return new Promise((resolve, reject) => {
    const try_listen = (p, left) => {
      const server = app.listen(p, '127.0.0.1');
      server.once('listening', () =>
        resolve({ server, port: server.address().port })
      );
      server.once('error', (error) => {
        if (error.code === 'EADDRINUSE' && left > 0 && p !== 0) {
          try_listen(p + 1, left - 1);
        } else {
          reject(error);
        }
      });
    };
    try_listen(port, attempts);
  });
}

module.exports = { create_kanban_app, start_kanban };
