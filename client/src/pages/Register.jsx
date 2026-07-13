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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      console.log("========== REGISTER SUCCESS ==========");
      console.log(res.data);

      alert(res.data.message || "Registration Successful ✅");

      navigate("/login");
    } catch (err) {
      console.log("========== REGISTER ERROR ==========");
      console.log(err);

      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Data:", err.response.data);

        alert(
          err.response.data.message || "Registration Failed"
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120]">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl shadow-2xl">

        <h1 className="text-4xl font-bold text-white text-center">
          Create Account 🚀
        </h1>

        <p className="text-gray-400 text-center mt-2 mb-8">
          Join TaskFlow AI today
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="text-white font-medium">
              Full Name
            </label>

            <Input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-white font-medium">
              Confirm Password
            </label>

            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit">
            Register
          </Button>

          <p className="text-center text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300"
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