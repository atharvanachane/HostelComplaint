const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["student", "admin"], default: "student" }
});

module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: String,
  description: String,
  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);


const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};


const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed
  });

  res.json(user);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

  res.json({ token, user });
};

const Complaint = require("../models/Complaint");

// CREATE
exports.createComplaint = async (req, res) => {
  const complaint = await Complaint.create({
    userId: req.user.id,
    category: req.body.category,
    description: req.body.description
  });

  res.json(complaint);
};

// READ
exports.getComplaints = async (req, res) => {
  let complaints;

  if (req.user.role === "admin") {
    complaints = await Complaint.find().populate("userId", "name");
  } else {
    complaints = await Complaint.find({ userId: req.user.id });
  }

  res.json(complaints);
};

// UPDATE
exports.updateComplaint = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) return res.status(404).json({ msg: "Not found" });

  // Only admin can update status
  if (req.user.role === "admin") {
    complaint.status = req.body.status || complaint.status;
  } else {
    complaint.description = req.body.description || complaint.description;
  }

  await complaint.save();
  res.json(complaint);
};

// DELETE
exports.deleteComplaint = async (req, res) => {
  await Complaint.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};