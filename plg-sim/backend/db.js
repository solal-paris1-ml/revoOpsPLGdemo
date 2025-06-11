const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.sqlite');

function initDB() {
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      toolName TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      company TEXT,
      phone TEXT,
      budget TEXT,
      message TEXT,
      product TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

function insertEvent(event) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO events (type, toolName) VALUES (?, ?)',
      [event.type, event.toolName],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

function getEvents() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM events ORDER BY timestamp DESC', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function insertContactMessage(data) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO contact_messages (name, email, company, phone, budget, message, product) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [data.name, data.email, data.company, data.phone, data.budget, data.message, data.product],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

function getContactMessages() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM contact_messages ORDER BY timestamp DESC', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = { initDB, insertEvent, getEvents, insertContactMessage, getContactMessages }; 