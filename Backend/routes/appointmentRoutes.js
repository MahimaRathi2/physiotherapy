const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getMyAppointments,
  cancelAppointment
} = require("../controllers/appointmentController");
const { protect, optionalAuth } = require("../middleware/authMiddleware");

router.post("/", protect, createAppointment);
router.get("/my-appointments", protect, getMyAppointments);
router.put("/:id/cancel", protect, cancelAppointment);

module.exports = router;
