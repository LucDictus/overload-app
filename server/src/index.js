const express = require("express");
const cors = require("cors");
const { getDb } = require("./database");

const exercisesRouter = require("./routes/exercises");
const workoutsRouter = require("./routes/workouts");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api/exercises", exercisesRouter);
app.use("/api/workouts", workoutsRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Overload API draait!" });
});

async function start() {
  await getDb();
  app.listen(PORT, () => {
    console.log(`✅ Server draait op http://localhost:${PORT}`);
    console.log(`📦 Database: data/overload.db`);
  });
}

start();