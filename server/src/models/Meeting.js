import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  amount: { type: Number, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  lat: { type: Number, required: true },
  log: { type: Number, required: true },
  qrCode: { type: String }, // base64 QR image
  createdBy: { type: String, required: true },
});

export default mongoose.model("Meeting", meetingSchema);
