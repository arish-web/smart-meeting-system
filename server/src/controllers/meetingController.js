import Meeting from "../models/Meeting.js";
import Attendance from "../models/Attendance.js";

export const getAttendance = async (req, res) => {
  try {
    const { meetingId } = req.params;
    console.log("📡 Fetching attendance for meeting:", meetingId);

    const attendanceRecords = await Attendance.find({ meetingId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ attendees: attendanceRecords });
  } catch (err) {
    console.error("❌ Error fetching attendance:", err);
    res.status(500).json({ message: "Server error fetching attendance" });
  }
};

export const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ createdAt: -1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching meetings" });
  }
};

export const deleteMeeting = async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.id);
    res.json({ message: "Meeting deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting meeting" });
  }
};
