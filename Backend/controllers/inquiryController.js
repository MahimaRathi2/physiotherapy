const Inquiry = require("../models/Inquiry");

const submitInquiry = async (req, res, next) => {
  try {
    const { name, phone, email, condition, preferredTime, preferredDate } = req.body;

    if (!name || !phone || !condition) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, phone number, and a description of your condition"
      });
    }

    const inquiry = await Inquiry.create({
      name,
      phone,
      email: email || "",
      condition,
      preferredTime: preferredTime || "Morning (10 AM - 12 PM)",
      preferredDate: preferredDate || ""
    });

    res.status(201).json({
      success: true,
      message: "Your inquiry has been submitted successfully! Our clinic team will reach out to you shortly.",
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitInquiry };
