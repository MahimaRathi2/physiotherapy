const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "FAQ question is required"],
      trim: true
    },
    answer: {
      type: String,
      required: [true, "FAQ answer is required"]
    },
    category: {
      type: String,
      default: "General"
    },
    order: {
      type: Number,
      default: 0
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

module.exports = mongoose.model("FAQ", faqSchema);
