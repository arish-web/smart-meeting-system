import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import Notiflix from "notiflix";

export default function MeetingDetails() {
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
  console.log("id", id);

  console.log("id", id);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const res = await API.get(`/api/meetings/${id}`);
        setMeeting(res.data.meeting);
      } catch (err) {
        console.error(err);
        Notiflix.Notify.failure("Failed to load meeting details");
      }
    };

    fetchMeeting();
  }, [id]);

  if (!meeting)
    return <div className="p-10 text-center">Loading meeting details...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10">
      <h2 className="text-2xl font-bold mb-4">{meeting.topic}</h2>
      <img
        src={meeting.qrCode}
        alt="Meeting QR Code"
        className="mx-auto w-60 h-60 border p-2 mb-6"
      />
      <p>
        <strong>Amount:</strong> ₹{meeting.amount}
      </p>
      <p>
        <strong>Start Time:</strong>{" "}
        {new Date(meeting.startTime).toLocaleString()}
      </p>
      <p>
        <strong>End Time:</strong> {new Date(meeting.endTime).toLocaleString()}
      </p>
      <p>
        <strong>Latitude:</strong> {meeting.lat}
      </p>
      <p>
        <strong>Longitude:</strong> {meeting.log}
      </p>
      <p className="mt-4 text-gray-500 text-sm">
        Scan this QR code during the meeting to mark your attendance.
      </p>
    </div>
  );
}
