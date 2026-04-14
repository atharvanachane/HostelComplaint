const Complaint = require("../models/Complaint");

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (student, admin)
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Please provide title, description, and category" });
    }

    const complaint = await Complaint.create({
      userId: req.user._id,
      title,
      description,
      category,
    });

    // Populate user info before returning
    await complaint.populate("userId", "name email roomNumber");

    res.status(201).json(complaint);
  } catch (error) {
    console.error("Create complaint error:", error);
    res.status(500).json({ message: "Server error creating complaint" });
  }
};

// @desc    Get complaints (admin sees all, student sees own)
// @route   GET /api/complaints
// @access  Private
exports.getComplaints = async (req, res) => {
  try {
    let complaints;

    if (req.user.role === "admin") {
      // Admin: see ALL complaints with user details
      complaints = await Complaint.find()
        .populate("userId", "name email roomNumber")
        .sort({ createdAt: -1 });
    } else {
      // Student: see only OWN complaints
      complaints = await Complaint.find({ userId: req.user._id })
        .populate("userId", "name email roomNumber")
        .sort({ createdAt: -1 });
    }

    res.json(complaints);
  } catch (error) {
    console.error("Get complaints error:", error);
    res.status(500).json({ message: "Server error fetching complaints" });
  }
};

// @desc    Update a complaint
// @route   PUT /api/complaints/:id
// @access  Private (admin can update status, student can update own description)
exports.updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (req.user.role === "admin") {
      // Admin can update status
      if (req.body.status) complaint.status = req.body.status;
      if (req.body.description) complaint.description = req.body.description;
    } else {
      // Student can only update their OWN complaint's description
      if (complaint.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Access denied. You can only edit your own complaints." });
      }
      if (req.body.description) complaint.description = req.body.description;
      if (req.body.title) complaint.title = req.body.title;
    }

    await complaint.save();
    await complaint.populate("userId", "name email roomNumber");

    res.json(complaint);
  } catch (error) {
    console.error("Update complaint error:", error);
    res.status(500).json({ message: "Server error updating complaint" });
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Private (admin can delete any, student can delete own)
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Students can only delete their own complaints
    if (req.user.role !== "admin" && complaint.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied. You can only delete your own complaints." });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Delete complaint error:", error);
    res.status(500).json({ message: "Server error deleting complaint" });
  }
};
