const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true
    },
    patientRole: {
      type: String,
      default: "Patient"
    },
    quote: {
      type: String,
      required: [true, "Testimonial quote is required"]
    },
    stars: {
      type: Number,
      default: 5,
      min: 1,
      max: 5
    },
    avatar: {
      type: String,
      default: ""
    },
    featured: {
      type: Boolean,
      default: true
    },
    approved: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
