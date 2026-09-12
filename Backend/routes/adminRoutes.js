const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllAppointments,
  updateAppointmentStatus,
  updatePaymentStatus,
  getAllPhysiotherapists,
  verifyPhysiotherapist,
  createPhysiotherapist,
  getAllUsers,
  updateUserRole,
  getAllServices,
  createService,
  deleteService,
  getAllOnlineConsultations,
  getAllTestimonials,
  createTestimonial,
  deleteTestimonial,
  getAllInquiries,
  getSystemSettings,
  updateSystemSettings,
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");

// All admin routes protected
router.use(protect);

router.get("/stats", getDashboardStats);
router.get("/appointments", getAllAppointments);
router.put("/appointments/:id/status", updateAppointmentStatus);
router.put("/appointments/:id/payment", updatePaymentStatus);

router.get("/doctors", getAllPhysiotherapists);
router.post("/doctors", createPhysiotherapist);
router.put("/doctors/:id/verify", verifyPhysiotherapist);

router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);

router.get("/services", getAllServices);
router.post("/services", createService);
router.delete("/services/:id", deleteService);

router.get("/online-consultations", getAllOnlineConsultations);

router.get("/testimonials", getAllTestimonials);
router.post("/testimonials", createTestimonial);
router.delete("/testimonials/:id", deleteTestimonial);

router.get("/inquiries", getAllInquiries);

router.get("/settings", getSystemSettings);
router.put("/settings", updateSystemSettings);

router.get("/blogs", getAllBlogs);
router.post("/blogs", createBlog);
router.put("/blogs/:id", updateBlog);
router.delete("/blogs/:id", deleteBlog);

module.exports = router;
