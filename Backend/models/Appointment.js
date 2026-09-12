const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      default: ""
    },
    service: {
      type: String,
      required: [true, "Service is required"],
      default: "Orthopedic Rehabilitation"
    },
    specialist: {
      type: String,
      default: "Dr. Satya Prakash"
    },
    date: {
      type: String,
      required: [true, "Appointment date is required"]
    },
    timeSlot: {
      type: String,
      required: [true, "Time slot is required"],
      default: "10:00 AM"
    },
    appointmentType: {
      type: String,
      enum: ["clinic", "home", "online-request"],
      default: "clinic"
    },
    homeAddress: {
      type: String,
      default: ""
    },
    cityArea: {
      type: String,
      default: ""
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending"
    },
    notes: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
