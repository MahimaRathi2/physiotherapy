const Physiotherapist = require("../models/Physiotherapist");
const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");
const User = require("../models/User");

// @desc    Get logged-in doctor's clinical profile
// @route   GET /api/v1/doctor/profile
// @access  Private (Doctor/Admin)
const getDoctorProfile = async (req, res, next) => {
  try {
    let doctor = await Physiotherapist.findOne({ user: req.user._id });

    // If profile doesn't exist yet, create default linked profile
    if (!doctor) {
      doctor = await Physiotherapist.create({
        user: req.user._id,
        name: req.user.name.startsWith("Dr.") ? req.user.name : `Dr. ${req.user.name}`,
        email: req.user.email,
        phone: req.user.phone,
        qualification: "MPT (Orthopedic Rehabilitation)",
        experienceYears: 8,
        specialization: "Spine & Joint Rehabilitation",
        servicesOffered: [
          "Orthopedic Rehabilitation",
          "Sports Injury Care",
          "Post-Operative Rehab",
          "Spine Therapy",
          "Home Physiotherapy"
        ],
        consultationFee: "₹800",
        availableSlots: ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "04:00 PM", "05:30 PM"],
        bio: "Dedicated physical therapy specialist focused on evidence-based non-surgical recovery."
      });
    }

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor clinical profile & availability
// @route   PUT /api/v1/doctor/profile
// @access  Private (Doctor/Admin)
const updateDoctorProfile = async (req, res, next) => {
  try {
    const {
      qualification,
      experienceYears,
      specialization,
      servicesOffered,
      consultationFee,
      availableSlots,
      bio,
      name
    } = req.body;

    const fieldsToUpdate = {};
    if (qualification !== undefined) fieldsToUpdate.qualification = qualification;
    if (experienceYears !== undefined) fieldsToUpdate.experienceYears = Number(experienceYears);
    if (specialization !== undefined) fieldsToUpdate.specialization = specialization;
    if (servicesOffered !== undefined) fieldsToUpdate.servicesOffered = Array.isArray(servicesOffered) ? servicesOffered : servicesOffered.split(',').map(s => s.trim());
    if (consultationFee !== undefined) fieldsToUpdate.consultationFee = consultationFee;
    if (availableSlots !== undefined) fieldsToUpdate.availableSlots = Array.isArray(availableSlots) ? availableSlots : availableSlots.split(',').map(s => s.trim());
    if (bio !== undefined) fieldsToUpdate.bio = bio;
    if (name !== undefined) fieldsToUpdate.name = name;

    let doctor = await Physiotherapist.findOneAndUpdate(
      { user: req.user._id },
      fieldsToUpdate,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Doctor profile & availability updated successfully!",
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments assigned to doctor or overall clinic list
// @route   GET /api/v1/doctor/appointments
// @access  Private (Doctor/Admin)
const getDoctorAppointments = async (req, res, next) => {
  try {
    // Fetch doctor name
    const doctor = await Physiotherapist.findOne({ user: req.user._id });
    const doctorName = doctor ? doctor.name : req.user.name;

    // Fetch appointments matching doctor's name or all appointments if admin/doctor
    let query = {};
    if (req.user.role === "doctor") {
      query = {
        $or: [
          { specialist: doctorName },
          { specialist: { $regex: req.user.name, $options: "i" } },
          { specialist: "Dr. Satya Prakash" }
        ]
      };
    }

    const appointments = await Appointment.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (Confirm, Reject, Mark Completed)
// @route   PUT /api/v1/doctor/appointments/:id/status
// @access  Private (Doctor/Admin)
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body; // status: 'upcoming', 'completed', 'cancelled'

    if (!["upcoming", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment record not found"
      });
    }

    // Send notification to patient if linked to a user account
    if (appointment.user) {
      let title = "Appointment Status Update";
      let msg = `Your appointment for ${appointment.date} at ${appointment.timeSlot} has been updated to: ${status}.`;

      if (status === "completed") {
        title = "Visit Completed";
        msg = `Thank you for visiting Satya Physiotherapy. Your consultation on ${appointment.date} with ${appointment.specialist} is marked completed.`;
      } else if (status === "cancelled") {
        title = "Appointment Cancelled by Specialist";
        msg = `Your appointment for ${appointment.date} was cancelled. ${note ? 'Reason: ' + note : ''}`;
      }

      await Notification.create({
        user: appointment.user,
        title,
        message: msg,
        type: "appointment"
      });
    }

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}`,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reschedule appointment date & time slot
// @route   PUT /api/v1/doctor/appointments/:id/reschedule
// @access  Private (Doctor/Admin)
const rescheduleDoctorAppointment = async (req, res, next) => {
  try {
    const { date, timeSlot } = req.body;

    if (!date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "Date and Time Slot are required for rescheduling"
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { date, timeSlot, status: "upcoming" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment record not found"
      });
    }

    if (appointment.user) {
      await Notification.create({
        user: appointment.user,
        title: "Appointment Rescheduled",
        message: `Your appointment with ${appointment.specialist} has been rescheduled to ${date} at ${timeSlot}.`,
        type: "appointment"
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment rescheduled successfully",
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update offline payment status (pending / paid)
// @route   PUT /api/v1/doctor/appointments/:id/payment
// @access  Private (Doctor/Admin)
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body; // 'pending' or 'paid'

    if (!["pending", "paid"].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status"
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment record not found"
      });
    }

    if (appointment.user && paymentStatus === "paid") {
      await Notification.create({
        user: appointment.user,
        title: "Offline Payment Confirmed",
        message: `Payment status for your appointment on ${appointment.date} has been marked as PAID (Received offline).`,
        type: "appointment"
      });
    }

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${paymentStatus}`,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorAppointments,
  updateAppointmentStatus,
  rescheduleDoctorAppointment,
  updatePaymentStatus
};
