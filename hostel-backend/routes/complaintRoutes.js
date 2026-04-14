const router = require("express").Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/rbac");
const {
  createComplaint,
  getComplaints,
  updateComplaint,
  deleteComplaint,
} = require("../controllers/complaintController");

// All routes require authentication
router.use(auth);

// Create complaint — any authenticated user
router.post("/", createComplaint);

// Get complaints — any authenticated user (filtered by role in controller)
router.get("/", getComplaints);

// Update complaint — any authenticated user (ownership checked in controller)
router.put("/:id", updateComplaint);

// Delete complaint — any authenticated user (ownership checked in controller)
router.delete("/:id", deleteComplaint);

module.exports = router;
