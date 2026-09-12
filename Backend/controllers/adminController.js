const User = require("../models/User");
const Physiotherapist = require("../models/Physiotherapist");
const Appointment = require("../models/Appointment");
const Service = require("../models/Service");
const OnlineConsultation = require("../models/OnlineConsultation");
const Inquiry = require("../models/Inquiry");
const Testimonial = require("../models/Testimonial");
const SystemSetting = require("../models/SystemSetting");
const Notification = require("../models/Notification");
const Blog = require("../models/Blog");

// @desc    Get Admin Dashboard KPI Statistics & Analytics
// @route   GET /api/v1/admin/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalPatients,
      totalDoctors,
      pendingDoctors,
      totalAppointments,
      completedAppointments,
      totalConsultations,
      totalInquiries,
      unreadInquiries
    ] = await Promise.all([
      User.countDocuments({ role: "patient" }),
      Physiotherapist.countDocuments({ active: true }),
      Physiotherapist.countDocuments({ active: false }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "completed" }),
      OnlineConsultation.countDocuments(),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: "new" })
    ]);

    // Estimated revenue calculation from paid appointments
    const paidAppointments = await Appointment.find({ paymentStatus: "paid" });
    const totalEstRevenue = paidAppointments.length * 800; // Average ₹800 fee

    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        pendingDoctors,
        totalAppointments,
        completedAppointments,
        totalConsultations,
        totalInquiries,
        unreadInquiries,
        totalEstRevenue: `₹${totalEstRevenue.toLocaleString()}`
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments for Admin with filters
// @route   GET /api/v1/admin/appointments
// @access  Private (Admin)
const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status
// @route   PUT /api/v1/admin/appointments/:id/status
// @access  Private (Admin)
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (appointment.user) {
      await Notification.create({
        user: appointment.user,
        title: "Appointment Status Updated",
        message: `Your appointment for ${appointment.date} is now marked as ${status.toUpperCase()}. ${note || ''}`,
        type: "appointment"
      });
    }

    res.status(200).json({ success: true, message: `Status updated to ${status}`, data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Update offline payment status
// @route   PUT /api/v1/admin/appointments/:id/payment
// @access  Private (Admin)
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({ success: true, message: `Payment status updated to ${paymentStatus}`, data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all physiotherapists
// @route   GET /api/v1/admin/doctors
// @access  Private (Admin)
const getAllPhysiotherapists = async (req, res, next) => {
  try {
    const doctors = await Physiotherapist.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify / Toggle active status of physiotherapist
// @route   PUT /api/v1/admin/doctors/:id/verify
// @access  Private (Admin)
const verifyPhysiotherapist = async (req, res, next) => {
  try {
    const doctor = await Physiotherapist.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    doctor.active = !doctor.active;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: `Doctor ${doctor.name} is now ${doctor.active ? 'VERIFIED & ACTIVE' : 'SUSPENDED'}`,
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new physiotherapist manually
// @route   POST /api/v1/admin/doctors
// @access  Private (Admin)
const createPhysiotherapist = async (req, res, next) => {
  try {
    const doctor = await Physiotherapist.create(req.body);
    res.status(201).json({ success: true, message: "Doctor created successfully", data: doctor });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users & patients
// @route   GET /api/v1/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (patient / doctor / admin)
// @route   PUT /api/v1/admin/users/:id/role
// @access  Private (Admin)
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    res.status(200).json({ success: true, message: `User role updated to ${role}`, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get services
// @route   GET /api/v1/admin/services
// @access  Private (Admin)
const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    next(error);
  }
};

// @desc    Create service
// @route   POST /api/v1/admin/services
// @access  Private (Admin)
const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, message: "Service created successfully", data: service });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /api/v1/admin/services/:id
// @access  Private (Admin)
const deleteService = async (req, res, next) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get online consultation requests
// @route   GET /api/v1/admin/online-consultations
// @access  Private (Admin)
const getAllOnlineConsultations = async (req, res, next) => {
  try {
    const requests = await OnlineConsultation.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Get testimonials
// @route   GET /api/v1/admin/testimonials
// @access  Private (Admin)
const getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
};

// @desc    Create testimonial
// @route   POST /api/v1/admin/testimonials
// @access  Private (Admin)
const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, message: "Testimonial created", data: testimonial });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/v1/admin/testimonials/:id
// @access  Private (Admin)
const deleteTestimonial = async (req, res, next) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Testimonial deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inquiries
// @route   GET /api/v1/admin/inquiries
// @access  Private (Admin)
const getAllInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    next(error);
  }
};

// @desc    Get System Settings
// @route   GET /api/v1/admin/settings
// @access  Private (Admin)
const getSystemSettings = async (req, res, next) => {
  try {
    let settings = await SystemSetting.findOne();
    if (!settings) {
      settings = await SystemSetting.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update System Settings
// @route   PUT /api/v1/admin/settings
// @access  Private (Admin)
const updateSystemSettings = async (req, res, next) => {
  try {
    let settings = await SystemSetting.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.status(200).json({ success: true, message: "System settings updated successfully", data: settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all blog articles
// @route   GET /api/v1/admin/blogs
// @access  Private (Admin)
const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new blog article (Admin only)
// @route   POST /api/v1/admin/blogs
// @access  Private (Admin)
const createBlog = async (req, res, next) => {
  try {
    const { title, category, author, readTime, image, excerpt, content, featured } = req.body;
    const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    const blog = await Blog.create({
      title,
      slug,
      category: category || "Orthopedic Care",
      author: author || "Dr. Satya Prakash & Team",
      readTime: readTime || "5 min read",
      image: image || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      excerpt,
      content,
      featured: featured || false,
      published: true
    });

    res.status(201).json({ success: true, message: "Blog article published successfully!", data: blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog article
// @route   DELETE /api/v1/admin/blogs/:id
// @access  Private (Admin)
const deleteBlog = async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Blog article deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog article
// @route   PUT /api/v1/admin/blogs/:id
// @access  Private (Admin)
const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog article not found" });
    }
    res.status(200).json({ success: true, message: "Blog article updated successfully!", data: blog });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
