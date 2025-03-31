const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./utils/db");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const frontendUrl = process.env.CLIENT_URL;
// Connect to MongoDB
connectDB();

// CORS Middleware
app.use(
  cors({
    // origin: process.env.CLIENT_URL, // Adjust to your frontend URL
    origin: { frontendUrl },
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);
// Middleware
app.use(express.json());
app.use(cookieParser());

// Import routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const contractRoutes = require("./routes/contractRoutes");
const notificationRoutes = require("./routes/notifications");

//for testing
app.get("/api/Api", (req, res) => {
  res.send("API is running...");
});
// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/notifications", notificationRoutes);

// Handle unknown routes and errors
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
