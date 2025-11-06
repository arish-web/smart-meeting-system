import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// POST /api/users → register new user
router.post(
  "/",
  [
    // 1️⃣ Name validation — only letters (spaces allowed)
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("Name can only contain letters and spaces"),

    // 2️⃣ Email validation — valid domain
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format")
      .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|co|co\.in)$/)
      .withMessage("Email must have a valid domain (.com, .co, .co.in)"),

    // 3️⃣ Password validation — strong rules
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8, max: 12 })
      .withMessage("Password must be 8–12 characters long")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      )
      .withMessage(
        "Password must include uppercase, lowercase, number, and special character"
      ),

    // 4️⃣ Phone — only digits, 10–15 length
    body("phone")
      .notEmpty()
      .withMessage("Phone number is required")
      .isNumeric()
      .withMessage("Phone must contain only numbers")
      .isLength({ min: 10, max: 15 })
      .withMessage("Phone number must be between 10–15 digits"),

    // 5️⃣ DOB — must match DD.MM.YYYY or DD-MM-YYYY or YYYY-MM-DD
    body("dob")
      .notEmpty()
      .withMessage("Date of birth is required")
      .matches(/^(\d{2}[./-]\d{2}[./-]\d{4}|\d{4}-\d{2}-\d{2})$/)
      .withMessage("DOB must be in valid format (DD-MM-YYYY or YYYY-MM-DD)"),

    // 6️⃣ Gender — required and only allow specific values
    body("gender")
      .notEmpty()
      .withMessage("Gender is required")
      .isIn(["Male", "Female", "Other"])
      .withMessage("Gender must be Male, Female, or Other"),
  ],
  async (req, res) => {
    // Validation result check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        name,
        email,
        password,
        phone,
        dob,
        gender,
        address,
        aboutUser,
        skills,
      } = req.body;

      // check if email already exists
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = `USR-${Date.now()}`;

      const user = await User.create({
        userId,
        name,
        email,
        password: hashedPassword,
        phone,
        dob,
        gender,
        address,
        aboutUser,
        skills,
      });

      res.status(201).json({ message: "User registered successfully", user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
