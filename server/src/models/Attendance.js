import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  meetingId: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting" },
  userId: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

export default mongoose.model("Attendance", attendanceSchema);
