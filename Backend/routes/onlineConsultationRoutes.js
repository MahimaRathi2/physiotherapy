const express = require("express");
const router = express.Router();
const {
  createOnlineConsultation,
  getMyOnlineConsultations
} = require("../controllers/onlineConsultationController");
const { protect, optionalAuth } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/", protect, upload.single("reportFile"), createOnlineConsultation);
router.get("/my-consultations", protect, getMyOnlineConsultations);

module.exports = router;
