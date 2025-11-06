import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Notiflix from "notiflix";
import API from "../api";

export default function Dashboard() {
  const [meetings, setMeetings] = useState([]);
  const navigate = useNavigate();

  const fetchMeetings = async () => {
    try {
      const res = await API.get("/api/meetings");
      setMeetings(res.data);
    } catch (err) {
      console.error(err);
      Notiflix.Notify.failure("Failed to fetch meetings");
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleDelete = async (id) => {
    Notiflix.Confirm.show(
      "Delete Meeting",
      "Are you sure you want to delete this meeting?",
      "Yes",
      "No",
      async () => {
        try {
          await API.delete(`/api/meetings/${id}`);
          Notiflix.Notify.success("Meeting deleted");
          fetchMeetings();
        } catch (err) {
          console.error(err);
          Notiflix.Notify.failure("Error deleting meeting");
        }
      }
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">All Meetings</h1>

      {meetings.length === 0 ? (
        <p className="text-gray-600">No meetings created yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Title</th>
                <th className="py-2 px-4 text-left">Start Time</th>
                <th className="py-2 px-4 text-left">End Time</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((m) => (
                <tr key={m._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{m.topic}</td>
                  <td className="py-2 px-4">
                    {new Date(m.startTime).toLocaleString()}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(m.endTime).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => navigate(`/meeting/${m._id}`)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      View QR
                    </button>
                    <button
                      onClick={() =>
                        navigate("/attendance", { state: { meetingId: m._id } })
                      }
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      View Attendance
                    </button>
                    <button
                      onClick={() => handleDelete(m._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
