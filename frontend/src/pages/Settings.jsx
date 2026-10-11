import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();

  const [reducedMotion, setReducedMotion] = useState(() => {
    return localStorage.getItem("setting_reduced_motion") === "true";
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem("setting_sound") !== "false";
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem("setting_high_contrast") === "true";
  });

  const handleToggleReducedMotion = () => {
    const next = !reducedMotion;
    setReducedMotion(next);
    localStorage.setItem("setting_reduced_motion", next.toString());
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem("setting_sound", next.toString());
  };

  const handleToggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    localStorage.setItem("setting_high_contrast", next.toString());
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of TaskFlow AI?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Workspace Settings
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Customize accessibility options, audio feedback, and account preferences.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Accessibility & Motion */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4">
              Accessibility & Motion Controls
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                <div>
                  <h3 className="font-semibold text-sm text-white">
                    Reduced Motion Mode
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Disables continuous 3D rotation and animations for users sensitive to motion.
                  </p>
                </div>
                <button
                  onClick={handleToggleReducedMotion}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    reducedMotion ? "bg-cyan-500" : "bg-slate-700"
                  }`}
                  aria-label="Toggle reduced motion"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      reducedMotion ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                <div>
                  <h3 className="font-semibold text-sm text-white">
                    Audio & Chime Feedback
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Plays sound chimes when Pomodoro focus intervals or actions finish.
                  </p>
                </div>
                <button
                  onClick={handleToggleSound}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    soundEnabled ? "bg-cyan-500" : "bg-slate-700"
                  }`}
                  aria-label="Toggle audio feedback"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      soundEnabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                <div>
                  <h3 className="font-semibold text-sm text-white">
                    High Contrast Text
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Enhances contrast on cards, badges, and filters for easier readability.
                  </p>
                </div>
                <button
                  onClick={handleToggleHighContrast}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    highContrast ? "bg-cyan-500" : "bg-slate-700"
                  }`}
                  aria-label="Toggle high contrast"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      highContrast ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Account Security & Actions */}
          <div className="pt-6 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white mb-4">
              Session & Account
            </h2>

            <div className="flex items-center justify-between p-4 bg-red-950/20 border border-red-900/50 rounded-2xl">
              <div>
                <h3 className="font-semibold text-sm text-red-300">
                  Log Out of Session
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Securely closes your local session and clears authorization tokens.
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Settings;