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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await api.post("/auth/login", formData);

      console.log("========== LOGIN SUCCESS ==========");
      console.log(res.data);

      // Save Token
      localStorage.setItem("token", res.data.token);

      // Save User
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      console.log(
        "Saved Token:",
        localStorage.getItem("token")
      );

      alert("Login Successful ✅");

      navigate("/dashboard");
    } catch (err) {
      console.log("========== LOGIN ERROR ==========");
      console.log(err);

      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Data:", err.response.data);

        alert(
          err.response.data.message || "Login Failed"
        );
      } else if (err.request) {
        console.log("No Response From Server");
        alert(
          "Cannot connect to backend.\nMake sure Express server is running."
        );
      } else {
        console.log(err.message);
        alert(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120]">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl shadow-2xl">

        <h1 className="text-4xl font-bold text-white text-center">
          Welcome Back 👋
        </h1>

        <p className="text-gray-400 text-center mt-2 mb-8">
          Login to your TaskFlow AI account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="text-white font-medium">
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
            <label className="text-white font-medium">
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

          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-cyan-400 hover:text-cyan-300"
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