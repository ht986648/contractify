const { ContractorUser, ContracteeUser } = require("../models/User");
const { generateToken } = require("../utils/jwtHelper");
const { sendVerificationEmail } = require("./sendVerificationMailController");
const bcrypt = require("bcrypt");

// Signup Controller
exports.contractorSignup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await ContractorUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create a random 6-digit verification code
    const emailVerificationToken = Math.floor(100000 + Math.random() * 900000);

    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = new ContractorUser({
      name,
      email,
      password,
      emailVerificationToken,
    });
    await user.save();

    const emailSent = await sendVerificationEmail(
      email,
      emailVerificationToken
    );

    const token = generateToken({
      id: user._id,
      email: email,
      role: "Contractor",
    });
    res
      .cookie("authToken", token, {
        httpOnly: true, // Ensures the cookie is sent only in HTTP(S) requests
        // secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        secure: true, // Use secure cookies in production
        sameSite: "none", // Prevent CSRF attacks
        domain: "contractify-backend.onrender.com",
      })
      .status(201)
      .json({
        message: "User registered successfully, please verify your email",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getToken = async (req, res) => {
  console.log("Cookies received:", req.cookies);
  try {
    // Retrieve token from cookies
    const token = req.cookies.authToken;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({ error: "No token found" });
    }

    // Send the token in the response
    res.status(200).json({ token });
  } catch (error) {
    console.error("Get Token Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.contracteeSignup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await ContracteeUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const emailVerificationToken = Math.floor(100000 + Math.random() * 900000);

    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = new ContracteeUser({
      name,
      email,
      password,
      emailVerificationToken,
    });
    await user.save();

    await sendVerificationEmail(email, emailVerificationToken);

    const token = generateToken({
      id: user._id,
      email: email,
      role: "Contractee",
    });
    res
      .cookie("authToken", token, {
        httpOnly: true, // Ensures the cookie is sent only in HTTP(S) requests
        // secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        secure: true, // Use secure cookies in production
        sameSite: "none", // Prevent CSRF attacks
        domain: "contractify-backend.onrender.com",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        message: "User registered successfully, please verify your email",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login Controller
exports.contracteeLogin = async (req, res) => {
  console.log(req.path);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await ContracteeUser.findOne({ email });
    if (!user) {
      return res.status(402).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = generateToken({
      id: user._id,
      email: email,
      role: "Contractee",
    });
    res
      .cookie("authToken", token, {
        httpOnly: true, // Ensures the cookie is sent only in HTTP(S) requests
        // secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        secure: true, // Use secure cookies in production
        sameSite: "none", // Prevent CSRF attacks
        domain: "contractify-backend.onrender.com",
        maxAge: 24 * 60 * 60 * 1000, // 1 hour in milliseconds
      })
      .status(200)
      .json({ message: "Login successful", token });
    console.log(token);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.contractorLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await ContractorUser.findOne({ email });
    if (!user) {
      return res.status(402).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = generateToken({
      id: user._id,
      email: email,
      role: "Contractor",
    });
    res
      .cookie("authToken", token, {
        httpOnly: true, // Ensures the cookie is sent only in HTTP(S) requests
        // secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        secure: true, // Use secure cookies in production
        sameSite: "none", // Prevent CSRF attacks
        domain: "contractify-backend.onrender.com",
        maxAge: 24 * 60 * 60 * 1000, // 1 hour in milliseconds
      })
      .status(200)
      .json({ message: "Login successful", token });
    console.log(token);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("authToken");
    res.status(200).json({ status: "Success", message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Failed", error: "Internal server error" });
  }
};
