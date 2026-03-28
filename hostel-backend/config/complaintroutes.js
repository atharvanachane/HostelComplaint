const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/complaintController");

router.post("/", auth, ctrl.createComplaint);
router.get("/", auth, ctrl.getComplaints);
router.put("/:id", auth, ctrl.updateComplaint);
router.delete("/:id", auth, ctrl.deleteComplaint);

module.exports = router;