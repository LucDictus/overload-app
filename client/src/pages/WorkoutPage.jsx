import { useState, useEffect } from "react";
import {
  getExercises,
  createWorkout,
  addSet,
  deleteSet,
  getExerciseHistory,
} from "../api";

function calcSuggestion(history) {
  if (!history.length) return null;
  const latestDate = history[0].date;
  const lastSets = history.filter((s) => s.date === latestDate);
  if (!lastSets.length) return null;
  const maxWeight = Math.max(...lastSets.map((s) => s.weight));
  const bestSet = lastSets.find((s) => s.weight === maxWeight);
  if (bestSet.reps >= 8) return { weight: maxWeight + 2.5, reps: bestSet.reps };
  return { weight: maxWeight, reps: bestSet.reps + 1 };
}

function getLastSession(history) {
  if (!history.length) return [];
  const latestDate = history[0].date;
  return history.filter((s) => s.date === latestDate);
}

export default function WorkoutPage() {
  const [workout, setWorkout] = useState(null);
  const [items, setItems] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    getExercises().then(setExercises);
  }, []);

  async function startWorkout() {
    setStarting(true);
    const w = await createWorkout();
    setWorkout(w);
    setPickerOpen(true);
    setStarting(false);
  }

  async function addExercise(exercise) {
    if (items.find((i) => i.exercise.id === exercise.id)) {
      closePicker();
      return;
    }
    const history = await getExerciseHistory(exercise.id);
    const suggestion = calcSuggestion(history);
    const lastSession = getLastSession(history);
    setItems((prev) => [
      ...prev,
      {
        exercise,
        sets: [],
        lastSession,
        suggestion,
        inputWeight: suggestion ? String(suggestion.weight) : "",
        inputReps: suggestion ? String(suggestion.reps) : "",
      },
    ]);
    closePicker();
  }

  function closePicker() {
    setPickerOpen(false);
    setSearch("");
  }

  function updateInput(exerciseId, field, value) {
    setItems((prev) =>
      prev.map((item) =>
        item.exercise.id === exerciseId ? { ...item, [field]: value } : item
      )
    );
  }

  async function logSet(exerciseId) {
    const item = items.find((i) => i.exercise.id === exerciseId);
    if (!item?.inputWeight || !item?.inputReps) return;
    const newSet = await addSet(workout.id, {
      exercise_id: exerciseId,
      set_number: item.sets.length + 1,
      weight: parseFloat(item.inputWeight),
      reps: parseInt(item.inputReps),
    });
    setItems((prev) =>
      prev.map((i) =>
        i.exercise.id === exerciseId ? { ...i, sets: [...i.sets, newSet] } : i
      )
    );
  }

  async function removeSet(exerciseId, setId) {
    await deleteSet(workout.id, setId);
    setItems((prev) =>
      prev.map((i) =>
        i.exercise.id === exerciseId
          ? { ...i, sets: i.sets.filter((s) => s.id !== setId) }
          : i
      )
    );
  }

  const filteredExercises = exercises.filter(
    (e) =>
      !items.find((i) => i.exercise.id === e.id) &&
      e.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!workout) {
    return (
      <div className="start-screen">
        <p className="start-date">
          {new Date().toLocaleDateString("nl-NL", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
        <button className="btn-start" onClick={startWorkout} disabled={starting}>
          {starting ? "Bezig..." : "Start Workout"}
        </button>
      </div>
    );
  }

  return (
    <div className="workout-page">
      {items.map((item) => (
        <ExerciseCard
          key={item.exercise.id}
          item={item}
          onUpdateInput={updateInput}
          onLogSet={logSet}
          onRemoveSet={removeSet}
        />
      ))}

      <button className="btn-add-exercise" onClick={() => setPickerOpen(true)}>
        + Oefening toevoegen
      </button>

      {pickerOpen && (
        <div className="picker-overlay" onClick={closePicker}>
          <div className="picker-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="picker-handle" />
            <div className="picker-header">
              <span className="picker-title">Oefening kiezen</span>
              <button className="btn-close" onClick={closePicker}>✕</button>
            </div>
            <input
              className="picker-search"
              type="text"
              placeholder="Zoeken..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            <div className="picker-list">
              {filteredExercises.length === 0 ? (
                <p className="picker-empty">Geen oefeningen gevonden</p>
              ) : (
                filteredExercises.map((ex) => (
                  <button key={ex.id} className="picker-item" onClick={() => addExercise(ex)}>
                    <span className="picker-name">{ex.name}</span>
                    <span className="picker-group">{ex.muscle_group}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExerciseCard({ item, onUpdateInput, onLogSet, onRemoveSet }) {
  const { exercise, sets, lastSession, suggestion } = item;

  return (
    <div className="exercise-card">
      <div className="exercise-card-header">
        <h2 className="exercise-card-name">{exercise.name}</h2>
        <span className="exercise-card-group">{exercise.muscle_group}</span>
      </div>

      {lastSession.length > 0 && (
        <div className="last-session">
          <span className="last-session-label">Vorige keer</span>
          <span className="last-session-sets">
            {lastSession.map((s) => `${s.weight}kg × ${s.reps}`).join(" · ")}
          </span>
        </div>
      )}

      {suggestion && (
        <div className="suggestion-chip">
          Doel vandaag: <strong>{suggestion.weight}kg × {suggestion.reps}</strong>
        </div>
      )}

      {sets.length > 0 && (
        <div className="sets-logged">
          {sets.map((s, i) => (
            <div key={s.id} className="set-logged-row">
              <span className="set-logged-num">Set {i + 1}</span>
              <span className="set-logged-data">{s.weight}kg × {s.reps}</span>
              <button
                className="btn-delete-set"
                onClick={() => onRemoveSet(exercise.id, s.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="set-input-row">
        <input
          className="set-input"
          type="number"
          inputMode="decimal"
          placeholder="kg"
          value={item.inputWeight}
          onChange={(e) => onUpdateInput(exercise.id, "inputWeight", e.target.value)}
        />
        <span className="set-input-sep">×</span>
        <input
          className="set-input"
          type="number"
          inputMode="numeric"
          placeholder="reps"
          value={item.inputReps}
          onChange={(e) => onUpdateInput(exercise.id, "inputReps", e.target.value)}
        />
        <button
          className="btn-log"
          onClick={() => onLogSet(exercise.id)}
          disabled={!item.inputWeight || !item.inputReps}
        >
          Log
        </button>
      </div>
    </div>
  );
}
