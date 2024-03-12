const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const path=require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create SQLite database connection
const db = new sqlite3.Database('tasks.db');

// Create tasks table if not exists
db.run(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_name TEXT NOT NULL,
  completed BOOLEAN DEFAULT 0
)`);

// GET route to fetch tasks from database
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// POST route to add task to database
app.post('/tasks', (req, res) => {
  const { task_name } = req.body;
  db.run('INSERT INTO tasks (task_name) VALUES (?)', [task_name], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// PATCH route to mark task as completed in database
app.patch('/tasks/:id', (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;
  db.run('UPDATE tasks SET completed = ? WHERE id = ?', [completed, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

// DELETE route to delete task from database
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});