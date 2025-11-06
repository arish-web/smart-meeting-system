import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // numeric password
  phone: String,
  dob: String,
  gender: String,
  profileImage: String,
  address: String,
  aboutUser: String,
  skills: [String],
});

const User = mongoose.model("User", userSchema);
export default User;
