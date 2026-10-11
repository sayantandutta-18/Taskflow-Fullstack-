import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import MemoryMatch from "../components/games/MemoryMatch";
import Game2048 from "../components/games/Game2048";
import TicTacToe from "../components/games/TicTacToe";
import ReactionGame from "../components/games/ReactionGame";

const GAMES = [
  {
    id: "memory",
    title: "Memory Match",
    icon: "🧠",
    desc: "Test visual recall by matching pairs in minimum moves.",
    component: MemoryMatch,
  },
  {
    id: "2048",
    title: "2048 Puzzle",
    icon: "🔢",
    desc: "Slide matching number tiles to reach the 2048 milestone.",
    component: Game2048,
  },
  {
    id: "tictactoe",
    title: "Tic-Tac-Toe",
    icon: "❌",
    desc: "Classic strategic 3x3 match against intelligent computer AI.",
    component: TicTacToe,
  },
  {
    id: "reaction",
    title: "Reaction Challenge",
    icon: "⚡",
    desc: "Measure reflex speed down to the exact millisecond.",
    component: ReactionGame,
  },
];

function GamesPage() {
  const [activeGameId, setActiveGameId] = useState("memory");

  const activeGame = GAMES.find((g) => g.id === activeGameId) || GAMES[0];
  const ActiveComponent = activeGame.component;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto py-2">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              Mini-Games Arcade
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Optional cognitive reset games completely isolated from task and auth data.
            </p>
          </div>
        </div>

        {/* Game Tab Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {GAMES.map((game) => {
            const isSelected = activeGameId === game.id;
            return (
              <button
                key={game.id}
                onClick={() => setActiveGameId(game.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                  isSelected
                    ? "bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/20"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <span className="text-2xl block mb-2">{game.icon}</span>
                <h3 className="font-bold text-sm text-white">{game.title}</h3>
                <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                  {game.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Game Stage */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{activeGame.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {activeGame.title}
                </h2>
                <p className="text-xs text-gray-400">{activeGame.desc}</p>
              </div>
            </div>
          </div>

          <ActiveComponent />
        </div>
      </div>
    </MainLayout>
  );
}

export default GamesPage;
