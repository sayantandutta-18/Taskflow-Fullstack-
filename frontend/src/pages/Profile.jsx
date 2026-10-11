import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function Profile() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  });

  const [profileData, setProfileData] = useState(null);

  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
  });

  useEffect(() => {
    let isMounted = true;

    // Fetch user profile from DB (for real XP, streak, achievements)
    api
      .get("/auth/profile")
      .then((res) => {
        if (isMounted) {
          setProfileData(res.data);
          setUser(res.data);
          // Update local storage so navbar reflects latest state
          try {
            const current = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem(
              "user",
              JSON.stringify({ ...current, ...res.data })
            );
          } catch {
            // ignore
          }
        }
      })
      .catch((err) => console.error("Profile fetch error:", err));

    // Fetch task stats
    api
      .get("/tasks")
      .then((res) => {
        if (isMounted) {
          const all = res.data;
          const comp = all.filter((t) => t.status === "Completed").length;
          const act = all.filter((t) => !t.archived && t.status !== "Completed").length;
          setTaskStats({ total: all.length, completed: comp, active: act });
        }
      })
      .catch((err) => console.error("Task stats error:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || "User"
  )}&background=06b6d4&color=fff&size=200`;

  // Real DB XP, Level, Streak, Achievements
  const xp = profileData?.xp ?? taskStats.completed * 10;
  const level = profileData?.level ?? Math.max(1, Math.floor(xp / 100) + 1);
  const streak = profileData?.streak ?? 0;
  const achievements = profileData?.achievements || [];

  const xpTowardsNextLevel = xp % 100;
  const xpProgressPercent = Math.min(100, xpTowardsNextLevel);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-800">
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="w-28 h-28 rounded-full border-4 border-cyan-500 shadow-xl shadow-cyan-500/20"
            />

            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-3xl font-black text-white">{user?.name || "TaskFlow User"}</h1>
                <span className="self-center sm:self-auto px-3.5 py-1 rounded-full text-xs font-bold bg-cyan-900/80 text-cyan-300 border border-cyan-700">
                  Level {level} Master
                </span>
              </div>
              <p className="text-gray-400 mt-1 text-sm">{user?.email || "No email"}</p>
              <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-950/60 border border-orange-800/80 px-3 py-1 rounded-full">
                  🔥 {streak} Day Streak
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 bg-purple-950/60 border border-purple-800/80 px-3 py-1 rounded-full">
                  ⭐ {xp} Total XP
                </span>
              </div>
            </div>
          </div>

          {/* Level Progression Bar */}
          <div className="mt-8 bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl">
            <div className="flex justify-between items-center text-xs font-bold text-gray-300 mb-2">
              <span className="text-cyan-400">Level {level} Progress</span>
              <span>
                {xpTowardsNextLevel} / 100 XP to Level {level + 1}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${xpProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Productivity Activity Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl text-center">
              <span className="text-xs text-gray-400 font-semibold uppercase">Total Tasks</span>
              <h3 className="text-2xl font-black text-white mt-1">{taskStats.total}</h3>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl text-center">
              <span className="text-xs text-green-400 font-semibold uppercase">Completed</span>
              <h3 className="text-2xl font-black text-green-400 mt-1">{taskStats.completed}</h3>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl text-center">
              <span className="text-xs text-yellow-400 font-semibold uppercase">Active Pending</span>
              <h3 className="text-2xl font-black text-yellow-400 mt-1">{taskStats.active}</h3>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl text-center">
              <span className="text-xs text-cyan-400 font-semibold uppercase">Earned XP</span>
              <h3 className="text-2xl font-black text-cyan-400 mt-1">{xp} XP</h3>
            </div>
          </div>

          {/* Achievements Showcase */}
          <div className="mt-8 pt-8 border-t border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              🏆 Unlocked Achievements ({achievements.length})
            </h3>
            {achievements.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-gray-400 text-sm">
                No achievements unlocked yet. Complete tasks to earn XP and unlock badges!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-cyan-800/60 flex items-center gap-3 shadow-lg"
                  >
                    <div className="text-2xl">🎖</div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{ach.title}</h4>
                      <p className="text-[11px] text-gray-400">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Details Information */}
          <div className="mt-8 pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-gray-500 block">Account Status</span>
              <span className="text-green-400 font-semibold">Active & Authenticated</span>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-gray-500 block">Database Storage</span>
              <span className="text-cyan-400 font-semibold">MongoDB Atlas Cloud</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Profile;