import { Routes, Route, NavLink } from "react-router-dom";
import WorkoutPage from "./pages/WorkoutPage";
import HistoryPage from "./pages/HistoryPage";
import ProgressPage from "./pages/ProgressPage";

export default function App() {
  return (
    <div>
      <nav>
        <NavLink to="/">Workout</NavLink>
        <NavLink to="/history">Geschiedenis</NavLink>
        <NavLink to="/progress">Progressie</NavLink>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<WorkoutPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Routes>
      </main>
    </div>
  );
}