const mongoose = require("mongoose");

const physiotherapistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      default: ""
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    title: {
      type: String,
      default: "Senior Physiotherapist"
    },
    qualification: {
      type: String,
      required: true,
      default: "MPT (Orthopedics)"
    },
    experienceYears: {
      type: Number,
      default: 10
    },
    specialization: {
      type: String,
      required: true,
      default: "Spine & Joint Rehabilitation"
    },
    servicesOffered: {
      type: [String],
      default: ["Orthopedic Rehabilitation", "Sports Injury Care", "Post-Operative Rehab", "Spine Therapy", "Home Physiotherapy"]
    },
    avatar: {
      type: String,
      default: "/images/cover.jpg"
    },
    bio: {
      type: String,
      default: "Dedicated physical therapy specialist focused on non-surgical recovery and movement rehabilitation."
    },
    consultationFee: {
      type: String,
      default: "₹800"
    },
    rating: {
      type: Number,
      default: 4.9
    },
    reviewsCount: {
      type: Number,
      default: 120
    },
    availableSlots: {
      type: [String],
      default: ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "04:00 PM", "05:30 PM"]
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Physiotherapist", physiotherapistSchema);
