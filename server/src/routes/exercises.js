const express = require("express");
const router = express.Router();
const { getDb, saveDb } = require("../database");

// GET alle oefeningen
router.get("/", async (req, res) => {
  const db = await getDb();
  const result = db.exec("SELECT * FROM exercises ORDER BY muscle_group, name");
  const exercises = result[0]
    ? result[0].values.map((row) => ({
        id: row[0],
        name: row[1],
        muscle_group: row[2],
        created_at: row[3],
      }))
    : [];
  res.json(exercises);
});

// POST nieuwe oefening
router.post("/", async (req, res) => {
  const { name, muscle_group } = req.body;
  if (!name || !muscle_group) {
    return res.status(400).json({ error: "name en muscle_group zijn verplicht" });
  }
  const db = await getDb();
  try {
    db.run("INSERT INTO exercises (name, muscle_group) VALUES (?, ?)", [name, muscle_group]);
    saveDb();
    const result = db.exec("SELECT last_insert_rowid() as id");
    const id = result[0].values[0][0];
    res.status(201).json({ id, name, muscle_group });
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(409).json({ error: "Oefening bestaat al" });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET progressie per oefening
router.get("/:id/history", async (req, res) => {
  const db = await getDb();
  const result = db.exec(
    `SELECT s.id, s.set_number, s.weight, s.reps, w.date, w.id as workout_id
     FROM sets s
     JOIN workouts w ON s.workout_id = w.id
     WHERE s.exercise_id = ?
     ORDER BY w.date DESC
     LIMIT 50`,
    [req.params.id]
  );
  const history = result[0]
    ? result[0].values.map((row) => ({
        id: row[0],
        set_number: row[1],
        weight: row[2],
        reps: row[3],
        date: row[4],
        workout_id: row[5],
      }))
    : [];
  res.json(history);
});

module.exports = router;