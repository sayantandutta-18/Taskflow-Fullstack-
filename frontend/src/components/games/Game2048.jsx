import { useState, useEffect, useCallback } from "react";

function getEmptyBoard() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

function spawnTile(board) {
  const emptyCells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) emptyCells.push({ r, c });
    }
  }
  if (emptyCells.length === 0) return board;
  const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newBoard = board.map((row) => [...row]);
  newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
}

function slideRow(row) {
  let arr = row.filter((val) => val !== 0);
  let scoreGain = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      scoreGain += arr[i];
      arr[i + 1] = 0;
      i++;
    }
  }
  arr = arr.filter((val) => val !== 0);
  while (arr.length < 4) {
    arr.push(0);
  }
  return { newRow: arr, scoreGain };
}

function rotateLeft(board) {
  const result = getEmptyBoard();
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      result[3 - c][r] = board[r][c];
    }
  }
  return result;
}

function rotateRight(board) {
  const result = getEmptyBoard();
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      result[c][3 - r] = board[r][c];
    }
  }
  return result;
}

function isGameOver(board) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) return false;
      if (r < 3 && board[r][c] === board[r + 1][c]) return false;
      if (c < 3 && board[r][c] === board[r][c + 1]) return false;
    }
  }
  return true;
}

const TILE_COLORS = {
  0: "bg-slate-800/60 text-transparent",
  2: "bg-slate-700 text-gray-200 font-bold",
  4: "bg-slate-600 text-gray-100 font-bold",
  8: "bg-orange-600 text-white font-black",
  16: "bg-orange-500 text-white font-black",
  32: "bg-red-500 text-white font-black",
  64: "bg-red-600 text-white font-black shadow-lg shadow-red-500/20",
  128: "bg-yellow-500 text-slate-950 font-black shadow-lg shadow-yellow-500/30",
  256: "bg-yellow-400 text-slate-950 font-black shadow-lg shadow-yellow-400/40",
  512: "bg-cyan-500 text-slate-950 font-black shadow-xl shadow-cyan-500/40",
  1024: "bg-blue-600 text-white font-black shadow-xl shadow-blue-500/50",
  2048: "bg-purple-600 text-white font-black shadow-2xl shadow-purple-500/60",
};

function Game2048() {
  const [board, setBoard] = useState(() => spawnTile(spawnTile(getEmptyBoard())));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem("2048_best") || "0", 10);
  });
  const [gameOver, setGameOver] = useState(false);

  const restart = () => {
    setBoard(spawnTile(spawnTile(getEmptyBoard())));
    setScore(0);
    setGameOver(false);
  };

  const moveLeft = useCallback(() => {
    if (gameOver) return;
    let gainedScore = 0;
    let changed = false;

    const newBoard = board.map((row) => {
      const { newRow, scoreGain } = slideRow(row);
      gainedScore += scoreGain;
      if (row.some((val, idx) => val !== newRow[idx])) changed = true;
      return newRow;
    });

    if (changed) {
      const spawned = spawnTile(newBoard);
      setBoard(spawned);
      const newScore = score + gainedScore;
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem("2048_best", newScore.toString());
      }
      if (isGameOver(spawned)) setGameOver(true);
    }
  }, [board, gameOver, score, bestScore]);

  const moveRight = useCallback(() => {
    if (gameOver) return;
    let gainedScore = 0;
    let changed = false;

    const newBoard = board.map((row) => {
      const reversed = [...row].reverse();
      const { newRow, scoreGain } = slideRow(reversed);
      gainedScore += scoreGain;
      const back = newRow.reverse();
      if (row.some((val, idx) => val !== back[idx])) changed = true;
      return back;
    });

    if (changed) {
      const spawned = spawnTile(newBoard);
      setBoard(spawned);
      const newScore = score + gainedScore;
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem("2048_best", newScore.toString());
      }
      if (isGameOver(spawned)) setGameOver(true);
    }
  }, [board, gameOver, score, bestScore]);

  const moveUp = useCallback(() => {
    if (gameOver) return;
    const rotated = rotateLeft(board);
    let gainedScore = 0;
    let changed = false;

    const moved = rotated.map((row) => {
      const { newRow, scoreGain } = slideRow(row);
      gainedScore += scoreGain;
      if (row.some((val, idx) => val !== newRow[idx])) changed = true;
      return newRow;
    });

    if (changed) {
      const reverted = rotateRight(moved);
      const spawned = spawnTile(reverted);
      setBoard(spawned);
      const newScore = score + gainedScore;
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem("2048_best", newScore.toString());
      }
      if (isGameOver(spawned)) setGameOver(true);
    }
  }, [board, gameOver, score, bestScore]);

  const moveDown = useCallback(() => {
    if (gameOver) return;
    const rotated = rotateRight(board);
    let gainedScore = 0;
    let changed = false;

    const moved = rotated.map((row) => {
      const { newRow, scoreGain } = slideRow(row);
      gainedScore += scoreGain;
      if (row.some((val, idx) => val !== newRow[idx])) changed = true;
      return newRow;
    });

    if (changed) {
      const reverted = rotateLeft(moved);
      const spawned = spawnTile(reverted);
      setBoard(spawned);
      const newScore = score + gainedScore;
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem("2048_best", newScore.toString());
      }
      if (isGameOver(spawned)) setGameOver(true);
    }
  }, [board, gameOver, score, bestScore]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowLeft") moveLeft();
      if (e.key === "ArrowRight") moveRight();
      if (e.key === "ArrowUp") moveUp();
      if (e.key === "ArrowDown") moveDown();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveLeft, moveRight, moveUp, moveDown]);

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-4">
        <div>
          <span className="text-xs text-gray-400 block font-semibold">Score</span>
          <span className="text-xl font-bold text-cyan-400">{score}</span>
        </div>
        <div>
          <span className="text-xs text-gray-400 block font-semibold">Best</span>
          <span className="text-xl font-bold text-yellow-400">{bestScore}</span>
        </div>
        <button
          onClick={restart}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl text-gray-200 transition"
        >
          🔄 New Game
        </button>
      </div>

      {gameOver && (
        <div className="bg-red-950/90 border border-red-700 p-3 rounded-2xl mb-4 text-red-300 font-bold text-sm">
          Game Over! No more valid moves.
        </div>
      )}

      {/* Grid Board */}
      <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl grid grid-cols-4 gap-2.5 max-w-sm mx-auto shadow-2xl">
        {board.flat().map((val, idx) => (
          <div
            key={idx}
            className={`h-16 sm:h-20 rounded-xl flex items-center justify-center text-lg sm:text-2xl transition-all select-none ${
              TILE_COLORS[val] || "bg-purple-700 text-white font-black"
            }`}
          >
            {val !== 0 ? val : ""}
          </div>
        ))}
      </div>

      {/* Mobile Touch Pad */}
      <div className="mt-6 flex flex-col items-center gap-2 max-w-[200px] mx-auto sm:hidden">
        <button
          onClick={moveUp}
          className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-white text-lg active:bg-cyan-600"
        >
          ▲
        </button>
        <div className="flex gap-4">
          <button
            onClick={moveLeft}
            className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-white text-lg active:bg-cyan-600"
          >
            ◀
          </button>
          <button
            onClick={moveDown}
            className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-white text-lg active:bg-cyan-600"
          >
            ▼
          </button>
          <button
            onClick={moveRight}
            className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-white text-lg active:bg-cyan-600"
          >
            ▶
          </button>
        </div>
      </div>
      <p className="text-[11px] text-gray-500 mt-4 hidden sm:block">
        Use Arrow Keys (← ↑ ↓ →) on your keyboard to slide tiles.
      </p>
    </div>
  );
}

export default Game2048;
