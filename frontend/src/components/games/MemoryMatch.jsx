import { useState, useEffect } from "react";

const CARD_ICONS = ["🚀", "⚡", "🎯", "🔥", "💎", "🌟", "🛡️", "🔮"];

function shuffleCards() {
  const deck = [...CARD_ICONS, ...CARD_ICONS].map((icon, id) => ({
    id,
    icon,
    flipped: false,
    matched: false,
  }));

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function MemoryMatch() {
  const [cards, setCards] = useState(shuffleCards);
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying && !isWon) {
      timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isWon]);

  const restart = () => {
    setCards(shuffleCards());
    setSelected([]);
    setMoves(0);
    setSeconds(0);
    setIsPlaying(false);
    setIsWon(false);
    setIsLocked(false);
  };

  const handleCardClick = (card, index) => {
    if (isLocked || card.flipped || card.matched) return;

    if (!isPlaying) setIsPlaying(true);

    const flippedCards = cards.map((c, i) =>
      i === index ? { ...c, flipped: true } : c
    );
    setCards(flippedCards);

    const newSelected = [...selected, { card, index }];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setIsLocked(true);
      setMoves((m) => m + 1);

      const [first, second] = newSelected;
      if (first.card.icon === second.card.icon) {
        const matchedCards = flippedCards.map((c, i) =>
          i === first.index || i === second.index ? { ...c, matched: true } : c
        );
        setCards(matchedCards);
        setSelected([]);
        setIsLocked(false);

        if (matchedCards.every((c) => c.matched)) {
          setIsWon(true);
          setIsPlaying(false);
        }
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === first.index || i === second.index ? { ...c, flipped: false } : c
            )
          );
          setSelected([]);
          setIsLocked(false);
        }, 900);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 text-center">
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-6">
        <div>
          <span className="text-xs text-gray-400 block font-semibold">Moves</span>
          <span className="text-xl font-bold text-cyan-400">{moves}</span>
        </div>
        <div>
          <span className="text-xs text-gray-400 block font-semibold">Time</span>
          <span className="text-xl font-bold text-white font-mono">{seconds}s</span>
        </div>
        <button
          onClick={restart}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl text-gray-200 transition"
        >
          🔄 Restart
        </button>
      </div>

      {isWon && (
        <div className="bg-green-950/80 border border-green-700 p-4 rounded-2xl mb-6 text-green-300 font-bold animate-pulse">
          🎉 Victory! Completed in {moves} moves and {seconds} seconds!
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card, idx)}
            className={`h-20 sm:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl cursor-pointer select-none transition-all duration-300 transform ${
              card.flipped || card.matched
                ? "bg-slate-800 border-2 border-cyan-400 rotate-0"
                : "bg-slate-900 border border-slate-700 hover:border-slate-500 hover:scale-105"
            } ${card.matched ? "opacity-60 border-green-500" : ""}`}
          >
            {card.flipped || card.matched ? card.icon : "❓"}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MemoryMatch;
