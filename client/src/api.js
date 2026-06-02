const BASE = "http://localhost:3001/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// Exercises
export const getExercises = () => request("/exercises");
export const createExercise = (name, muscle_group) =>
  request("/exercises", {
    method: "POST",
    body: JSON.stringify({ name, muscle_group }),
  });
export const getExerciseHistory = (exerciseId) =>
  request(`/exercises/${exerciseId}/history`);

// Workouts
export const getWorkouts = () => request("/workouts");
export const createWorkout = (name) =>
  request("/workouts", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
export const getWorkoutSets = (workoutId) =>
  request(`/workouts/${workoutId}/sets`);
export const addSet = (workoutId, { exercise_id, set_number, weight, reps }) =>
  request(`/workouts/${workoutId}/sets`, {
    method: "POST",
    body: JSON.stringify({ exercise_id, set_number, weight, reps }),
  });
export const deleteSet = (workoutId, setId) =>
  request(`/workouts/${workoutId}/sets/${setId}`, { method: "DELETE" });
