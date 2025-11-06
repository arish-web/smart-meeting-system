import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QrScanner from "react-qr-scanner";
import API from "../api";
import Notiflix from "notiflix";

export default function Attendance() {
  const { meetingId } = useParams();
  const [attendees, setAttendees] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleScan = async (data) => {
    if (!data || scanned) return;
    const text = typeof data === "string" ? data : data?.text || data?.data;

    if (!text) return;
    setScanned(true);

    try {
      console.log("📸 Scanned text:", text);
      if (!text.includes(",")) throw new Error("Invalid QR format");

      const qrData = JSON.parse(atob(text.split(",")[1]));
      const { meetingId: scannedMeetingId } = qrData;

      if (!scannedMeetingId) {
        Notiflix.Notify.failure("Invalid QR: missing meeting ID");
        setScanned(false);
        return;
      }

      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        Notiflix.Notify.failure("Please log in first");
        setScanned(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await API.post("/api/meetings/attend", {
              meetingId: scannedMeetingId,
              userId,
              lat: latitude,
              log: longitude,
            });
            Notiflix.Notify.success(res.data.message || "Attendance marked!");
            fetchAttendance(scannedMeetingId);
            setScanning(false);
          } catch (apiErr) {
            console.error("❌ API Error:", apiErr);
            Notiflix.Notify.failure(
              apiErr.response?.data?.message || "Failed to mark attendance"
            );
            setScanned(false);
          }
        },
        (err) => {
          console.error("❌ Geolocation error:", err);
          Notiflix.Notify.failure("Enable location access to mark attendance");
          setScanned(false);
        }
      );
    } catch (err) {
      console.error("❌ QR decode error:", err);
      Notiflix.Notify.failure("Invalid or corrupted QR code");
      setScanned(false);
    }
  };

  const handleError = (err) => {
    console.error("QR Scanner error:", err);
    Notiflix.Notify.failure("Camera error or permission denied");
  };

  const fetchAttendance = async () => {
    try {
      const res = await API.get(`/api/meetings/${meetingId}/attendance`);
      setAttendees(res.data.attendees || []);
    } catch (err) {
      console.error("❌ Fetch attendance error:", err);
      Notiflix.Notify.failure("Failed to load attendance list");
    }
  };

  useEffect(() => {
    if (meetingId);
    fetchAttendance(meetingId);
  }, [meetingId]);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-4">Attendance</h2>

      {/* Show scanner when clicking button */}
      {!scanning ? (
        <button
          onClick={() => {
            setScanning(true);
            setScanned(false);
          }}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          📷 Scan QR to Mark Attendance
        </button>
      ) : (
        <div className="mt-6 flex flex-col items-center">
          <div className="w-[300px] h-[300px] border rounded overflow-hidden shadow">
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%", height: "100%" }}
              constraints={{
                video: {
                  facingMode: { ideal: "environment" },
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                },
              }}
            />
          </div>
          <button
            onClick={() => setScanning(false)}
            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded"
          >
            ✖ Close Scanner
          </button>
        </div>
      )}

      {/* Attendance list */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-3">Attendance List</h3>
        {attendees.length === 0 ? (
          <p className="text-gray-600">No attendees yet.</p>
        ) : (
          <ul className="list-disc pl-6">
            {attendees.map((item, i) => (
              <li key={i} className="py-1">
                👤 User ID: {item.userId} — 🕒{" "}
                {new Date(item.time).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
