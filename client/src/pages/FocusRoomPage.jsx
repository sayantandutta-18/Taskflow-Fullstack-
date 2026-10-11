import { useState, useEffect, useRef } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

const MODES = {
  focus: { label: "Focus Session", duration: 25 * 60, icon: "🎯" },
  shortBreak: { label: "Short Break", duration: 5 * 60, icon: "☕" },
  longBreak: { label: "Long Break", duration: 15 * 60, icon: "🧘" },
};

function playCompletionChime() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
  } catch (e) {
    console.warn("Audio playback not supported:", e);
  }
}

function FocusRoomPage() {
  const [mode, setMode] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(() => {
    return parseInt(localStorage.getItem("focus_sessions_count") || "0", 10);
  });
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");

  const intervalRef = useRef(null);

  useEffect(() => {
    api
      .get("/tasks")
      .then((res) => setTasks(res.data.filter((t) => !t.archived && t.status === "Pending")))
      .catch((err) => console.error(err));
  }, []);

  const switchMode = (newMode) => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);

            if (soundEnabled) {
              playCompletionChime();
            }

            if (mode === "focus") {
              setCompletedSessions((count) => {
                const next = count + 1;
                localStorage.setItem("focus_sessions_count", next.toString());
                return next;
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, soundEnabled, mode]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(MODES[mode].duration);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  const currentDuration = MODES[mode].duration;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((currentDuration - timeLeft) / currentDuration) * 100)
  );

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white via-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Focus Room
          </h1>
          <p className="text-gray-400 mt-2 text-sm max-w-md mx-auto">
            Deep-work Pomodoro timer designed to eliminate distractions and build lasting momentum.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center gap-2 mb-8 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl max-w-md mx-auto">
          {Object.entries(MODES).map(([key, info]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                mode === key
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="mr-1.5">{info.icon}</span>
              {info.label}
            </button>
          ))}
        </div>

        {/* Active Task Selector */}
        <div className="max-w-md mx-auto mb-8">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-center">
            Currently Focusing On
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-gray-200 focus:ring-2 focus:ring-cyan-500 outline-none"
          >
            <option value="">🎯 General Focus Session</option>
            {tasks.map((t) => (
              <option key={t._id} value={t._id}>
                {t.title} ({t.priority} Priority)
              </option>
            ))}
          </select>
        </div>

        {/* Big Circular / Card Timer */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl text-center relative overflow-hidden max-w-lg mx-auto">
          {/* Progress bar background glow */}
          <div
            className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />

          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-800 text-cyan-400 border border-slate-700 mb-6">
            {MODES[mode].label}
          </span>

          {/* Time Display */}
          <div className="text-7xl sm:text-8xl font-black tracking-tight text-white font-mono my-2 select-none">
            {formattedTime}
          </div>

          <p className="text-xs text-gray-400 mt-2 mb-8">
            {isRunning ? "Session in progress..." : "Timer paused"}
          </p>

          {/* Controls */}
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={handleStartPause}
              className={`px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl transition-all duration-300 hover:scale-105 ${
                isRunning
                  ? "bg-yellow-500 hover:bg-yellow-400 text-slate-950"
                  : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
              }`}
            >
              {isRunning ? "⏸ Pause" : "▶ Start Session"}
            </button>

            <button
              onClick={handleReset}
              className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-gray-300 font-semibold text-sm transition"
            >
              🔄 Reset
            </button>
          </div>

          {/* Audio Chime Toggle */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-2">
              <span>🔔 Chime at completion</span>
            </span>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-1 rounded-full font-semibold transition ${
                soundEnabled
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-800 text-gray-400 hover:text-white"
              }`}
            >
              {soundEnabled ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-8">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
            <p className="text-xs text-gray-400 uppercase font-semibold">
              Sessions Completed
            </p>
            <h3 className="text-3xl font-extrabold text-cyan-400 mt-1">
              {completedSessions}
            </h3>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
            <p className="text-xs text-gray-400 uppercase font-semibold">
              Focus Time
            </p>
            <h3 className="text-3xl font-extrabold text-blue-400 mt-1">
              {completedSessions * 25}m
            </h3>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default FocusRoomPage;
