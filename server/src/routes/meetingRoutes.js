import express from "express";
import QRCode from "qrcode";
import Meeting from "../models/Meeting.js";
import {
  getMeetings,
  deleteMeeting,
  getAttendance,
} from "../controllers/meetingController.js";
import Attendance from "../models/Attendance.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/",
  [
    body("topic")
      .notEmpty()
      .withMessage("Meeting topic is required")
      .isLength({ min: 3 })
      .withMessage("Topic must be at least 3 characters long"),

    body("amount")
      .notEmpty()
      .withMessage("Amount is required")
      .isNumeric()
      .withMessage("Amount must be a valid number"),

    body("startTime")
      .notEmpty()
      .withMessage("Start time is required")
      .isISO8601()
      .withMessage("Invalid start time format"),

    body("endTime")
      .notEmpty()
      .withMessage("End time is required")
      .isISO8601()
      .withMessage("Invalid end time format"),

    body("lat")
      .notEmpty()
      .withMessage("Latitude is required")
      .isFloat({ min: -90, max: 90 })
      .withMessage("Latitude must be between -90 and 90"),

    body("log")
      .notEmpty()
      .withMessage("Longitude is required")
      .isFloat({ min: -180, max: 180 })
      .withMessage("Longitude must be between -180 and 180"),

    body("createdBy").notEmpty().withMessage("CreatedBy user ID is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { topic, amount, startTime, endTime, lat, log, createdBy } =
        req.body;

      const meeting = await Meeting.create({
        topic,
        amount,
        startTime,
        endTime,
        lat,
        log,
        createdBy,
      });

      const qrPayload = { meetingId: meeting._id.toString() };
      const encoded = btoa(JSON.stringify(qrPayload));
      const qrCode = await QRCode.toDataURL(`data,${encoded}`);

      meeting.qrCode = qrCode;
      await meeting.save();

      res
        .status(201)
        .json({ message: "Meeting created successfully", meeting });
    } catch (error) {
      console.error("Error creating meeting:", error);
      res.status(500).json({ message: "Server error creating meeting" });
    }
  }
);

router.get("/:id", async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    console.log("meeting", meeting);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.status(200).json({ meeting });
  } catch (error) {
    console.error("Error fetching meeting:", error);
    res.status(500).json({ message: "Server error fetching meeting" });
  }
});

router.post("/attend", async (req, res) => {
  try {
    const { meetingId, userId, lat, log } = req.body;

    if (!meetingId || !userId) {
      return res
        .status(400)
        .json({ message: "Meeting ID and User ID required" });
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    const alreadyMarked = await Attendance.findOne({ meetingId, userId });
    if (alreadyMarked) {
      return res
        .status(400)
        .json({ message: "You have already marked attendance" });
    }

    await Attendance.create({
      meetingId,
      userId,
      lat,
      log,
    });

    res.json({ message: "Attendance marked successfully!" });
    fetchAttendance(meetingId);
  } catch (error) {
    console.error("❌ Attendance Error:", error);
    res.status(500).json({ message: "Server error while marking attendance" });
  }
});

router.get("/:meetingId/attendance", async (req, res) => {
  console.log("🟢 Route triggered! Params:", req.params);

  try {
    const { meetingId } = req.params;
    const attendanceRecords = await Attendance.find({ meetingId });
    console.log("📋 Attendance records found:", attendanceRecords);

    res.json({ attendees: attendanceRecords });
  } catch (err) {
    console.error("❌ Error fetching attendance:", err);
    res.status(500).json({ message: "Server error fetching attendance" });
  }
});

router.get("/:meetingId/attendance", getAttendance);
router.get("/", getMeetings);
router.delete("/:id", deleteMeeting);

export default router;
