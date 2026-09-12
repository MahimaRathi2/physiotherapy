const mongoose = require("mongoose");

const systemSettingSchema = new mongoose.Schema(
  {
    clinicName: {
      type: String,
      default: "Satya Physiotherapy Center"
    },
    address: {
      type: String,
      default: "Plot 12, Main Ring Road, Lajpat Nagar, New Delhi - 110024"
    },
    phone: {
      type: String,
      default: "+91 7500831828"
    },
    emergencyHelpline: {
      type: String,
      default: "+91 7500831828"
    },
    email: {
      type: String,
      default: "contact@satyaphyseo.com"
    },
    businessHours: {
      type: String,
      default: "Mon - Sat: 08:00 AM - 08:00 PM | Sun: 09:00 AM - 02:00 PM"
    },
    siteAnnouncement: {
      type: String,
      default: "Welcome to Satya Physiotherapy Center — Evidence-Based Non-Surgical Recovery."
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("SystemSetting", systemSettingSchema);
