import { useState, useRef } from "react";

function ReactionGame() {
  const [gameState, setGameState] = useState("idle"); // idle, waiting, ready, finished, early
  const [reactionTime, setReactionTime] = useState(null);
  const [bestTime, setBestTime] = useState(() => {
    return parseInt(localStorage.getItem("reaction_best") || "0", 10);
  });

  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  const startTest = () => {
    setGameState("waiting");
    setReactionTime(null);

    const randomDelay = Math.floor(Math.random() * 3000) + 1500; // 1.5s - 4.5s
    timerRef.current = setTimeout(() => {
      setGameState("ready");
      startTimeRef.current = Date.now();
    }, randomDelay);
  };

  const handleBoxClick = () => {
    if (gameState === "idle") {
      startTest();
    } else if (gameState === "waiting") {
      clearTimeout(timerRef.current);
      setGameState("early");
    } else if (gameState === "ready") {
      const diff = Date.now() - startTimeRef.current;
      setReactionTime(diff);
      setGameState("finished");

      if (bestTime === 0 || diff < bestTime) {
        setBestTime(diff);
        localStorage.setItem("reaction_best", diff.toString());
      }
    } else if (gameState === "finished" || gameState === "early") {
      startTest();
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-6">
        <div>
          <span className="text-xs text-gray-400 block font-semibold">Your Score</span>
          <span className="text-xl font-bold text-cyan-400">
            {reactionTime ? `${reactionTime} ms` : "---"}
          </span>
        </div>
        <div>
          <span className="text-xs text-gray-400 block font-semibold">Best Time</span>
          <span className="text-xl font-bold text-green-400">
            {bestTime ? `${bestTime} ms` : "---"}
          </span>
        </div>
      </div>

      {/* Main Click Box */}
      <div
        onClick={handleBoxClick}
        className={`w-full h-72 rounded-3xl flex flex-col items-center justify-center p-6 cursor-pointer select-none transition-all duration-200 shadow-2xl ${
          gameState === "idle"
            ? "bg-slate-900 border-2 border-dashed border-slate-700 hover:border-cyan-400"
            : gameState === "waiting"
            ? "bg-red-950 border-2 border-red-600"
            : gameState === "ready"
            ? "bg-emerald-600 text-white animate-pulse"
            : gameState === "early"
            ? "bg-amber-950 border-2 border-amber-600"
            : "bg-slate-900 border border-slate-800"
        }`}
      >
        {gameState === "idle" && (
          <div>
            <span className="text-5xl block mb-3">⚡</span>
            <h3 className="text-xl font-bold text-white">Click Here to Start</h3>
            <p className="text-gray-400 text-xs mt-2">
              Wait for green, then click as fast as possible.
            </p>
          </div>
        )}

        {gameState === "waiting" && (
          <div>
            <span className="text-5xl block mb-3">🛑</span>
            <h3 className="text-2xl font-black text-red-400">Wait for Green...</h3>
            <p className="text-gray-400 text-xs mt-2">Do not click yet!</p>
          </div>
        )}

        {gameState === "ready" && (
          <div>
            <span className="text-5xl block mb-3">🟢</span>
            <h3 className="text-4xl font-black text-white">CLICK NOW!</h3>
          </div>
        )}

        {gameState === "early" && (
          <div>
            <span className="text-5xl block mb-3">⚠️</span>
            <h3 className="text-2xl font-bold text-amber-400">Too Early!</h3>
            <p className="text-gray-300 text-xs mt-2">Click to try again.</p>
          </div>
        )}

        {gameState === "finished" && (
          <div>
            <span className="text-5xl block mb-3">🎯</span>
            <h3 className="text-4xl font-black text-cyan-400">{reactionTime} ms</h3>
            <p className="text-gray-400 text-xs mt-2">Click to test again.</p>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Normal human visual reaction time averages between 200ms and 250ms.
      </p>
    </div>
  );
}

export default ReactionGame;
