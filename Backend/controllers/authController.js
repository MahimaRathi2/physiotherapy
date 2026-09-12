const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Physiotherapist = require("../models/Physiotherapist");

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

// Helper to send token response with cookie
const sendTokenResponse = (user, statusCode, res, message = "Success") => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  };

  res
    .status(statusCode)
    .cookie("jwt", token, cookieOptions)
    .json({
      success: true,
      message,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar || "",
        address: user.address || ""
      }
    });
};

// @desc    Register a new user account (patient or doctor)
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role = "patient" } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, phone, and password"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists"
      });
    }

    const validRole = ["doctor", "admin", "patient"].includes(role) ? role : "patient";

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: validRole
    });

    if (validRole === "doctor") {
      await Physiotherapist.create({
        user: user._id,
        name: user.name.startsWith("Dr.") ? user.name : `Dr. ${user.name}`,
        email: user.email,
        phone: user.phone,
        qualification: "MPT (Orthopedic Rehabilitation)",
        experienceYears: 8,
        specialization: "Spine & Joint Rehabilitation",
        servicesOffered: ["Orthopedic Rehabilitation", "Sports Injury Care", "Post-Operative Rehab", "Spine Therapy", "Home Physiotherapy"],
        consultationFee: "₹800",
        bio: "Dedicated physical therapy specialist focused on evidence-based non-surgical recovery."
      });
    }

    sendTokenResponse(user, 201, res, "Account registered successfully!");
  } catch (error) {
    next(error);
  }
};

// @desc    Login patient / user
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    sendTokenResponse(user, 200, res, "Login successful!");
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/v1/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  res.cookie("jwt", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};

// @desc    Get current logged in user profile
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile details
// @route   PUT /api/v1/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (email) fieldsToUpdate.email = email;
    if (phone) fieldsToUpdate.phone = phone;
    if (address !== undefined) fieldsToUpdate.address = address;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/v1/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current password and new password"
      });
    }

    const user = await User.findById(req.user.id).select("+password");
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect current password"
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, "Password changed successfully!");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword
};
