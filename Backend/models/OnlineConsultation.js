const mongoose = require("mongoose");

const onlineConsultationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    phone: {
      type: String,
      required: [true, "Contact phone is required"],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      default: ""
    },
    condition: {
      type: String,
      required: [true, "Please describe your problem or condition"]
    },
    preferredDate: {
      type: String,
      required: [true, "Preferred date is required"]
    },
    preferredTime: {
      type: String,
      required: [true, "Preferred time slot is required"]
    },
    additionalInfo: {
      type: String,
      default: ""
    },
    reportFile: {
      type: String,
      default: ""
    },
    physiotherapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Physiotherapist",
      required: false
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "contacted"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("OnlineConsultation", onlineConsultationSchema);
