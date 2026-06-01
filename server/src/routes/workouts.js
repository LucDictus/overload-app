const express = require("express");
const router = express.Router();
const { getDb, saveDb } = require("../database");

// GET alle workouts
router.get("/", async (req, res) => {
  const db = await getDb();
  const result = db.exec("SELECT * FROM workouts ORDER BY date DESC LIMIT 20");
  const workouts = result[0]
    ? result[0].values.map((row) => ({ id: row[0], name: row[1], date: row[2] }))
    : [];
  res.json(workouts);
});

// POST nieuwe workout
router.post("/", async (req, res) => {
  const { name } = req.body;
  const db = await getDb();
  db.run("INSERT INTO workouts (name) VALUES (?)", [name || "Workout"]);
  saveDb();
  const result = db.exec("SELECT last_insert_rowid() as id");
  const id = result[0].values[0][0];
  const workout = db.exec("SELECT * FROM workouts WHERE id = ?", [id]);
  const row = workout[0].values[0];
  res.status(201).json({ id: row[0], name: row[1], date: row[2] });
});

// GET sets van een workout
router.get("/:id/sets", async (req, res) => {
  const db = await getDb();
  const result = db.exec(
    `SELECT s.*, e.name as exercise_name, e.muscle_group
     FROM sets s
     JOIN exercises e ON s.exercise_id = e.id
     WHERE s.workout_id = ?
     ORDER BY s.exercise_id, s.set_number`,
    [req.params.id]
  );
  const sets = result[0]
    ? result[0].values.map((row) => ({
        id: row[0],
        workout_id: row[1],
        exercise_id: row[2],
        set_number: row[3],
        weight: row[4],
        reps: row[5],
        exercise_name: row[6],
        muscle_group: row[7],
      }))
    : [];
  res.json(sets);
});

// POST set toevoegen
router.post("/:id/sets", async (req, res) => {
  const { exercise_id, set_number, weight, reps } = req.body;
  if (!exercise_id || !weight || !reps) {
    return res.status(400).json({ error: "exercise_id, weight en reps zijn verplicht" });
  }
  const db = await getDb();
  db.run(
    "INSERT INTO sets (workout_id, exercise_id, set_number, weight, reps) VALUES (?, ?, ?, ?, ?)",
    [req.params.id, exercise_id, set_number || 1, weight, reps]
  );
  saveDb();
  const result = db.exec("SELECT last_insert_rowid() as id");
  const id = result[0].values[0][0];
  res.status(201).json({ id, workout_id: Number(req.params.id), exercise_id, set_number, weight, reps });
});

// DELETE set verwijderen
router.delete("/:workoutId/sets/:setId", async (req, res) => {
  const db = await getDb();
  db.run("DELETE FROM sets WHERE id = ? AND workout_id = ?", [req.params.setId, req.params.workoutId]);
  saveDb();
  res.json({ success: true });
});

module.exports = router;