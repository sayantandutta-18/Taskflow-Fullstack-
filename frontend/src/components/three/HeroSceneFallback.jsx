function HeroSceneFallback() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
      {/* Outer ambient glow */}
      <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-purple-600/20 blur-3xl" />

      {/* 2D / CSS 3D Fallback Orb */}
      <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-950 p-[2px] shadow-2xl shadow-cyan-500/30">
        <div className="w-full h-full rounded-full bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-4 border border-cyan-500/30">
          <span className="text-4xl md:text-5xl animate-pulse">⚡</span>
          <span className="text-sm font-semibold text-cyan-300 mt-2 tracking-wide uppercase">
            TaskFlow AI Core
          </span>
          <span className="text-xs text-gray-400 mt-1">
            Focus & Productivity Engine
          </span>
        </div>
      </div>

      {/* Orbiting Satellite Cards */}
      <div className="absolute top-12 left-10 md:left-24 bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-xl text-xs text-gray-300 shadow-xl hidden sm:flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Tasks Synced</span>
      </div>

      <div className="absolute bottom-16 right-10 md:right-24 bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-xl text-xs text-gray-300 shadow-xl hidden sm:flex items-center gap-2">
        <span className="text-cyan-400">🎯</span>
        <span>Deep Focus Active</span>
      </div>
    </div>
  );
}

export default HeroSceneFallback;
