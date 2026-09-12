const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");

// @desc    Schedule / book a new appointment
// @route   POST /api/v1/appointments
// @access  Public (Optional auth)
const createAppointment = async (req, res, next) => {
  try {
    const {
      patientName,
      phone,
      email,
      service,
      specialist,
      date,
      timeSlot,
      notes,
      appointmentType = "clinic",
      homeAddress = "",
      cityArea = ""
    } = req.body;

    if (!patientName || !phone || !date) {
      return res.status(400).json({
        success: false,
        message: "Patient name, phone number, and appointment date are required"
      });
    }

    if (appointmentType === "home") {
      if (!homeAddress || !cityArea) {
        return res.status(400).json({
          success: false,
          message: "Home address and City / Area are required for Home Physiotherapy visits"
        });
      }
    }

    const appointmentData = {
      patientName,
      phone,
      email: email || "",
      service: service || "Orthopedic Rehabilitation",
      specialist: specialist || "Dr. Satya Prakash",
      date,
      timeSlot: timeSlot || "10:00 AM",
      appointmentType,
      homeAddress: homeAddress || "",
      cityArea: cityArea || "",
      paymentStatus: "pending",
      notes: notes || ""
    };

    if (req.user) {
      appointmentData.user = req.user._id;
    }

    const appointment = await Appointment.create(appointmentData);

    // Notification for logged-in user
    if (req.user) {
      const isHome = appointmentType === "home";
      await Notification.create({
        user: req.user._id,
        title: isHome ? "Home Physiotherapy Booked" : "Clinic Appointment Booked",
        message: isHome
          ? `Your home visit with ${appointment.specialist} for ${appointment.service} on ${appointment.date} at ${appointment.timeSlot} has been confirmed. Address: ${appointment.homeAddress}, ${appointment.cityArea}.`
          : `Your clinic visit with ${appointment.specialist} for ${appointment.service} on ${appointment.date} at ${appointment.timeSlot} has been confirmed.`,
        type: "appointment"
      });
    }

    res.status(201).json({
      success: true,
      message: appointmentType === "home" ? "Home Physiotherapy Visit scheduled successfully!" : "In-Person Appointment scheduled successfully!",
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments for current logged in patient
// @route   GET /api/v1/appointments/my-appointments
// @access  Private
const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an appointment
// @route   PUT /api/v1/appointments/:id/cancel
// @access  Private
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: "cancelled" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    await Notification.create({
      user: req.user._id,
      title: "Appointment Cancelled",
      message: `Your appointment scheduled for ${appointment.date} at ${appointment.timeSlot} has been cancelled.`,
      type: "appointment"
    });

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  cancelAppointment
};
