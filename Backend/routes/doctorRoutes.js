const express = require("express");
const router = express.Router();
const {
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorAppointments,
  updateAppointmentStatus,
  rescheduleDoctorAppointment,
  updatePaymentStatus
} = require("../controllers/doctorController");
const { protect } = require("../middleware/authMiddleware");

// All doctor routes are protected for authenticated users
router.use(protect);

router.get("/profile", getDoctorProfile);
router.put("/profile", updateDoctorProfile);
router.get("/appointments", getDoctorAppointments);
router.put("/appointments/:id/status", updateAppointmentStatus);
router.put("/appointments/:id/reschedule", rescheduleDoctorAppointment);
router.put("/appointments/:id/payment", updatePaymentStatus);

module.exports = router;
