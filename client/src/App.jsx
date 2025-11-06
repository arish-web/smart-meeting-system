import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateMeeting from "./pages/CreateMeeting.jsx";
import Attendance from "./pages/Attendance.jsx";
import Navbar from "./components/Navbar.jsx";
import MeetingDetails from "./pages/MeetingDetails";
import QRPage from "./pages/QRPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-meeting" element={<CreateMeeting />} />
          <Route path="/meeting/:id" element={<MeetingDetails />} />
          <Route path="/scan" element={<QRPage />} />
          <Route path="/attendance/:meetingId" element={<Attendance />} />
          <Route path="/attendance" element={<Attendance />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
