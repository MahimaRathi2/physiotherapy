const OnlineConsultation = require("../models/OnlineConsultation");
const Notification = require("../models/Notification");

const createOnlineConsultation = async (req, res, next) => {
  try {
    const { name, phone, email, condition, preferredDate, preferredTime, additionalInfo, physiotherapistId } = req.body;

    if (!name || !phone || !condition || !preferredDate || !preferredTime) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields (Name, Phone, Condition, Preferred Date, Preferred Time)"
      });
    }

    let reportFilePath = "";
    if (req.file) {
      reportFilePath = `/uploads/${req.file.filename}`;
    }

    const consultationData = {
      name,
      phone,
      email: email || "",
      condition,
      preferredDate,
      preferredTime,
      additionalInfo: additionalInfo || "",
      reportFile: reportFilePath,
      physiotherapist: physiotherapistId || null
    };

    if (req.user) {
      consultationData.user = req.user._id;
    }

    const consultation = await OnlineConsultation.create(consultationData);

   
    if (req.user) {
      await Notification.create({
        user: req.user._id,
        title: "Online Consultation Request Submitted",
        message: `Your request for ${preferredDate} at ${preferredTime} has been received. Our clinical team will review your report and contact you shortly.`,
        type: "consultation"
      });
    }

    res.status(201).json({
      success: true,
      message: "Online Consultation Request submitted successfully!",
      data: consultation
    });
  } catch (error) {
    next(error);
  }
};

const getMyOnlineConsultations = async (req, res, next) => {
  try {
    const consultations = await OnlineConsultation.find({ user: req.user._id })
      .populate("physiotherapist", "name title qualification avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: consultations.length,
      data: consultations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOnlineConsultation,
  getMyOnlineConsultations
};
