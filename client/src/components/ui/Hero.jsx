import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import HeroSceneFallback from "../three/HeroSceneFallback";

const HeroScene = lazy(() => import("../three/HeroScene"));

function Hero() {
  return (
    <section className="relative min-h-[92vh] bg-slate-950 text-white flex items-center justify-center px-6 py-12 overflow-hidden">
      {/* Background radial gradient accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Column: Accessible HTML Text & Call to Action */}
        <div className="text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold text-sm">
            <span>✨</span>
            <span>TaskFlow AI Experience</span>
          </div>

          <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Master Your Day. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
              Elevate Your Flow.
            </span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-xl leading-relaxed">
            The next-generation productivity hub with real task lifecycle management, 
            interactive Focus Room, Arcade mini-games, and verified achievement gamification.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link
              to="/register"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-8 py-4 rounded-xl text-center shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
            >
              Get Started Free 🚀
            </Link>

            <Link
              to="/login"
              className="border border-slate-700 hover:bg-slate-800 text-gray-200 font-semibold px-8 py-4 rounded-xl text-center transition-all duration-300 hover:border-slate-500"
            >
              Sign In
            </Link>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80">
            <div>
              <p className="text-2xl font-extrabold text-cyan-400">100%</p>
              <p className="text-xs text-gray-400 mt-0.5">Database Backed</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-blue-400">3D</p>
              <p className="text-xs text-gray-400 mt-0.5">Interactive Visuals</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-purple-400">XP</p>
              <p className="text-xs text-gray-400 mt-0.5">Gamified Progress</p>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Hero Scene with Lazy Loading and Graceful Fallback */}
        <div className="relative flex items-center justify-center">
          <Suspense fallback={<HeroSceneFallback />}>
            <HeroScene />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

export default Hero;