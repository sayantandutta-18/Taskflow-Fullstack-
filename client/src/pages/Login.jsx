import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await api.post("/auth/login", formData);

      // Save Token & User in LocalStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      console.error("========== LOGIN ERROR ==========", err);

      if (err.response) {
        setErrorMessage(
          err.response.data?.message ||
          (err.response.status === 404
            ? "API route not found. Please verify backend URL."
            : "Login failed. Please check your credentials.")
        );
      } else if (err.request) {
        setErrorMessage(
          "Cannot connect to the backend server. If using Render, the free instance may take ~30-40 seconds to wake up. Please wait a moment and try again."
        );
      } else {
        setErrorMessage(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120] p-4">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800">
        <h1 className="text-4xl font-bold text-white text-center">
          Welcome Back 👋
        </h1>

        <p className="text-gray-400 text-center mt-2 mb-6">
          Login to your TaskFlow AI account
        </p>

        {/* In-Page Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-sm">
            <div className="flex items-start gap-2.5">
              <span className="text-lg shrink-0">⚠️</span>
              <div>
                <p className="font-bold">Connection / Login Issue</p>
                <p className="text-xs text-red-300 mt-1 whitespace-pre-wrap leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-white font-medium text-sm block mb-1.5">
              Email
            </label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-white font-medium text-sm block mb-1.5">
              Password
            </label>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;