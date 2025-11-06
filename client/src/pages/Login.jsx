import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Notiflix from "notiflix";
import API from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post(`/api/login`, form);
      Notiflix.Notify.success("Login successful!");
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("userId", res.data.userId);
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data) {
        const { errors, message } = err.response.data;

        if (errors && Array.isArray(errors) && errors.length > 0) {
          Notiflix.Notify.failure(errors[0].msg);
        } else if (message) {
          Notiflix.Notify.failure(message);
        } else {
          Notiflix.Notify.failure("Something went wrong. Please try again.");
        }
      } else {
        Notiflix.Notify.failure("Network error. Please check your connection.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-20">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
      <p className="mt-4 text-center">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
