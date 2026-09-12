require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");
const apiRoutes = require("./routes/index");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// Connect to MongoDB Atlas
connectDB();

// CORS Middleware supporting both localhost and 127.0.0.1 origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation"));
      }
    },
    credentials: true
  })
);

// Body parser & Cookie parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static folder for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Satya Physiotherapy Center Backend API is running successfully!"
  });
});

// API Routes
app.use("/api/v1", apiRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});