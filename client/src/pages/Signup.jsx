import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import Notiflix from "notiflix";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    gender: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/api/users`, form);
      Notiflix.Notify.success("Signup successful!");
      navigate("/login");
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
        Sign Up
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
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
        <input
          type="text"
          placeholder="Phone"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          type="date"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
        />
        <select
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
