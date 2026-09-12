const mongoose = require("mongoose");

const clinicInfoSchema = new mongoose.Schema(
  {
    clinicName: {
      type: String,
      default: "Satya Physiotherapy Center"
    },
    tagline: {
      type: String,
      default: "Move better. Heal deeper. Live stronger."
    },
    helpline: {
      type: String,
      default: "+91 7500831828"
    },
    address: {
      type: String,
      default: "Satya Physiotherapy Center, Main Road, New Delhi"
    },
    email: {
      type: String,
      default: "contact@satyaphysio.com"
    },
    clinicHours: {
      type: String,
      default: "Mon–Sat: 8 AM – 8 PM · Sun: 9 AM – 1 PM"
    },
    heroStats: {
      yearsPractice: { type: String, default: "15+" },
      recoveriesGuided: { type: String, default: "12k+" },
      recommendationRate: { type: String, default: "98%" },
      ratingScore: { type: String, default: "4.9 / 5" },
      totalReviews: { type: String, default: "from 900+ patient reviews" }
    },
    promotionalBanner: {
      title: { type: String, default: "Ready To Move Without Pain?" },
      subtitle: { type: String, default: "Book your initial consultation and comprehensive movement assessment with our specialist team today." },
      badge: { type: String, default: "PHYSIOTHERAPY · REHAB · PERFORMANCE" }
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

module.exports = mongoose.model("ClinicInfo", clinicInfoSchema);
