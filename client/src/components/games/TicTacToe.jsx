import { useState } from "react";

const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner(board) {
  for (const [a, b, c] of WINNING_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo: [a, b, c] };
    }
  }
  if (board.every((cell) => cell !== null)) {
    return { winner: "Draw", combo: [] };
  }
  return null;
}

function makeComputerMove(currentBoard) {
  // 1. Try winning move
  for (const [a, b, c] of WINNING_COMBOS) {
    const line = [currentBoard[a], currentBoard[b], currentBoard[c]];
    if (line.filter((x) => x === "O").length === 2 && line.includes(null)) {
      const emptyIdx = [a, b, c].find((idx) => currentBoard[idx] === null);
      return emptyIdx;
    }
  }
  // 2. Block player X winning move
  for (const [a, b, c] of WINNING_COMBOS) {
    const line = [currentBoard[a], currentBoard[b], currentBoard[c]];
    if (line.filter((x) => x === "X").length === 2 && line.includes(null)) {
      const emptyIdx = [a, b, c].find((idx) => currentBoard[idx] === null);
      return emptyIdx;
    }
  }
  // 3. Take center if free
  if (currentBoard[4] === null) return 4;
  // 4. Random available cell
  const emptyIndices = currentBoard
    .map((val, idx) => (val === null ? idx : null))
    .filter((v) => v !== null);
  if (emptyIndices.length > 0) {
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }
  return -1;
}

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [vsComputer, setVsComputer] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const winInfo = checkWinner(board);

  const handleClick = (idx) => {
    if (board[idx] || winInfo) return;

    const nextBoard = board.map((val, i) => (i === idx ? (isXNext ? "X" : "O") : val));
    setBoard(nextBoard);

    const postWin = checkWinner(nextBoard);
    if (postWin) {
      updateScore(postWin.winner);
      return;
    }

    if (vsComputer && isXNext) {
      setIsXNext(false);
      // Computer Turn (plays as 'O')
      setTimeout(() => {
        const aiIdx = makeComputerMove(nextBoard);
        if (aiIdx !== -1) {
          const aiBoard = nextBoard.map((val, i) => (i === aiIdx ? "O" : val));
          setBoard(aiBoard);
          const aiWin = checkWinner(aiBoard);
          if (aiWin) {
            updateScore(aiWin.winner);
          } else {
            setIsXNext(true);
          }
        }
      }, 300);
    } else {
      setIsXNext(!isXNext);
    }
  };

  const updateScore = (winner) => {
    if (winner === "X") setScores((s) => ({ ...s, X: s.X + 1 }));
    else if (winner === "O") setScores((s) => ({ ...s, O: s.O + 1 }));
    else if (winner === "Draw") setScores((s) => ({ ...s, draws: s.draws + 1 }));
  };

  const restart = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      {/* Mode toggle and score */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-6">
        <div>
          <span className="text-xs text-cyan-400 block font-semibold">You (X)</span>
          <span className="text-xl font-bold text-white">{scores.X}</span>
        </div>
        <div>
          <span className="text-xs text-gray-400 block font-semibold">Draws</span>
          <span className="text-xl font-bold text-gray-400">{scores.draws}</span>
        </div>
        <div>
          <span className="text-xs text-purple-400 block font-semibold">
            {vsComputer ? "AI (O)" : "Player 2 (O)"}
          </span>
          <span className="text-xl font-bold text-white">{scores.O}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => {
            setVsComputer(!vsComputer);
            restart();
          }}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 text-gray-300 hover:text-white border border-slate-700"
        >
          Mode: {vsComputer ? "🤖 vs AI" : "👥 Two Players"}
        </button>

        <button
          onClick={restart}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 text-gray-300 hover:text-white border border-slate-700"
        >
          🔄 New Game
        </button>
      </div>

      {winInfo && (
        <div
          className={`p-3 rounded-xl mb-4 font-bold text-sm ${
            winInfo.winner === "Draw"
              ? "bg-slate-800 text-yellow-300"
              : winInfo.winner === "X"
              ? "bg-cyan-950 border border-cyan-700 text-cyan-300"
              : "bg-purple-950 border border-purple-700 text-purple-300"
          }`}
        >
          {winInfo.winner === "Draw"
            ? "🤝 Match Drawn!"
            : `🏆 Player ${winInfo.winner} Wins!`}
        </div>
      )}

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-3 max-w-[300px] mx-auto bg-slate-950 p-3 rounded-2xl border border-slate-800 shadow-2xl">
        {board.map((cell, idx) => {
          const isWinningCell = winInfo?.combo?.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              className={`h-20 sm:h-24 rounded-xl flex items-center justify-center text-4xl font-black select-none transition-all ${
                isWinningCell
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/40"
                  : cell
                  ? "bg-slate-800 text-white"
                  : "bg-slate-900 hover:bg-slate-800 text-transparent"
              } ${cell === "X" ? "text-cyan-400" : "text-purple-400"}`}
            >
              {cell}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TicTacToe;
