import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged Out Successfully");

    navigate("/login");
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto bg-slate-900 rounded-2xl p-8 mt-10">

        <h1 className="text-3xl font-bold mb-8">
          ⚙ Settings
        </h1>

        <div className="space-y-5">

          <div className="bg-slate-800 p-5 rounded-xl">
            <h2 className="text-xl font-semibold">
              🔒 Change Password
            </h2>

            <p className="text-gray-400 mt-2">
              Coming Soon...
            </p>
          </div>

          <div className="bg-slate-800 p-5 rounded-xl">
            <h2 className="text-xl font-semibold">
              🌙 Dark Mode
            </h2>

            <p className="text-gray-400 mt-2">
              Coming Soon...
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg"
          >
            Logout
          </button>

        </div>

      </div>
    </MainLayout>
  );
}

export default Settings;