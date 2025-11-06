import React, { useState } from "react";
import QrScanner from "react-qr-scanner";
import Notiflix from "notiflix";
import API from "../api";

export default function QRPage() {
  const [scanned, setScanned] = useState(false);

  const handleScan = async (data) => {
    if (data && !scanned) {
      setScanned(true);

      try {
        const qrData = JSON.parse(atob(data.split(",")[1]));
        const { meetingId } = qrData;

        if (!meetingId) {
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
            const res = await API.post("/api/meetings/attend", {
              meetingId,
              userId,
              lat: latitude,
              log: longitude,
            });
            Notiflix.Notify.success(res.data.message || "Attendance marked!");
          },
          (err) => {
            console.error(err);
            Notiflix.Notify.failure(
              "Enable location access to mark attendance"
            );
            setScanned(false);
          }
        );
      } catch (err) {
        console.error(err);
        Notiflix.Notify.failure("Invalid or corrupted QR code");
        setScanned(false);
      }
    }
  };

  const handleError = (err) => {
    console.error("QR Scanner error:", err);
    Notiflix.Notify.failure("Camera error or permission denied");
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h2 className="text-xl font-bold mb-4">Scan Meeting QR Code</h2>
      <div className="w-[300px] h-[300px]">
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "100%", height: "100%" }}
          constraints={{ facingMode: "environment" }}
        />
      </div>
      {!scanned ? (
        <p className="mt-3 text-gray-600">
          Point your camera at the meeting QR
        </p>
      ) : (
        <p className="mt-3 text-green-600">✅ Attendance marked</p>
      )}
    </div>
  );
}
