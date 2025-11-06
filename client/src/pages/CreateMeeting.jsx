import { useState } from "react";
import axios from "axios";
import Notiflix from "notiflix";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

const CreateMeeting = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    topic: "",
    amount: "",
    startTime: "",
    endTime: "",
    lat: "",
    log: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdBy = sessionStorage.getItem("userId");
      const res = await API.post(`/api/meetings`, {
        ...form,
        createdBy,
      });
      Notiflix.Notify.success("Meeting created successfully!");
      sessionStorage.setItem("meetingId", res.data.meetingId);
      console.log("res.data.meeting", res.data.meeting);
      navigate(`/meeting/${res.data.meeting._id}`);
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
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-xl font-bold mb-4">Create Meeting</h2>
      <form onSubmit={handleSubmit}>
        {["topic", "amount", "startTime", "endTime", "lat", "log"].map(
          (field) => (
            <input
              key={field}
              type={field.includes("Time") ? "datetime-local" : "text"}
              placeholder={field}
              className="w-full p-3 border mb-3 rounded-lg"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          )
        )}
        <button className="bg-blue-500 text-white w-full py-2 rounded-lg">
          Create Meeting
        </button>
      </form>
    </div>
  );
};

export default CreateMeeting;
