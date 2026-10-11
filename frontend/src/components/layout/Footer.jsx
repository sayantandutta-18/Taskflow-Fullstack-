function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-900 py-6">

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">

        {/* Left */}
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            🚀 TaskFlow AI
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            Organize. Prioritize. Achieve.
          </p>
        </div>

        {/* Center */}
        <div className="text-gray-500 text-sm mt-4 md:mt-0">
          © {new Date().getFullYear()} TaskFlow AI. All Rights Reserved.
        </div>

        {/* Right */}
        <div className="text-sm text-gray-400 mt-4 md:mt-0">
          Developed with ❤️ by{" "}
          <span className="font-semibold text-cyan-400">
            Sayantan Dutta
          </span>
        </div>

      </div>
    </footer>
  );
}

export default Footer; 