import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setSuccessMessage(res.data?.message || "Registration Successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("========== REGISTER ERROR ==========", err);

      if (err.response) {
        setErrorMessage(
          err.response.data?.message ||
          (err.response.status === 404
            ? "API route not found. Please verify backend URL."
            : "Registration failed. Please try again.")
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
          Create Account 🚀
        </h1>

        <p className="text-gray-400 text-center mt-2 mb-6">
          Join TaskFlow AI today
        </p>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-sm">
            <div className="flex items-start gap-2.5">
              <span className="text-lg shrink-0">⚠️</span>
              <div>
                <p className="font-bold">Registration / Connection Error</p>
                <p className="text-xs text-red-300 mt-1 whitespace-pre-wrap leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-green-950/80 border border-green-800 text-green-200 text-sm">
            <p className="font-bold">✓ {successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white font-medium text-sm block mb-1">
              Full Name
            </label>
            <Input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-white font-medium text-sm block mb-1">
              Email Address
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
            <label className="text-white font-medium text-sm block mb-1">
              Password
            </label>
            <Input
              type="password"
              name="password"
              placeholder="Create a password (min 6 chars)"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-white font-medium text-sm block mb-1">
              Confirm Password
            </label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? "Registering..." : "Create Account"}
          </Button>

          <p className="text-center text-gray-400 text-sm pt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;