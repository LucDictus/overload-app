const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../data/overload.db");

let db;

async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs();

  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      muscle_group TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      date TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_id INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,
      set_number INTEGER NOT NULL,
      weight REAL NOT NULL,
      reps INTEGER NOT NULL,
      FOREIGN KEY (workout_id) REFERENCES workouts(id),
      FOREIGN KEY (exercise_id) REFERENCES exercises(id)
    )
  `);

  const result = db.exec("SELECT COUNT(*) as count FROM exercises");
  const count = result[0]?.values[0][0];

  if (count === 0) {
    const defaultExercises = [
      ["Bench Press", "Borst"],
      ["Squat", "Benen"],
      ["Deadlift", "Rug"],
      ["Overhead Press", "Schouders"],
      ["Barbell Row", "Rug"],
      ["Pull-up", "Rug"],
      ["Bicep Curl", "Armen"],
      ["Tricep Pushdown", "Armen"],
      ["Leg Press", "Benen"],
      ["Romanian Deadlift", "Benen"],
    ];

    defaultExercises.forEach(([name, muscle_group]) => {
      db.run("INSERT INTO exercises (name, muscle_group) VALUES (?, ?)", [name, muscle_group]);
    });
  }

  saveDb();
  return db;
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

module.exports = { getDb, saveDb };