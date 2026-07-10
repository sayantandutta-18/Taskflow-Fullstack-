import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="min-h-[90vh] bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="max-w-5xl text-center">

        <span className="inline-block px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 font-semibold">
          🚀 AI Powered Task Management
        </span>

        <h1 className="text-5xl md:text-7xl font-extrabold mt-8 leading-tight">
          Organize Your <br />
          Work Smarter with AI
        </h1>

        <p className="text-gray-400 text-lg mt-8 max-w-3xl mx-auto">
          TaskFlow AI helps you organize tasks, manage projects,
          collaborate with your team and boost productivity using
          Artificial Intelligence.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-5 mt-10">

          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl font-semibold"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="border border-gray-600 hover:bg-slate-800 transition px-8 py-4 rounded-xl font-semibold"
          >
            Login
          </Link>

        </div>

      </div>
    </section>
  );
}

export default Hero;