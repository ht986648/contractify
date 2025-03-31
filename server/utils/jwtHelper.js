const jwt = require("jsonwebtoken");
const { ContractorUser, ContracteeUser } = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

module.exports = {
  generateToken: (payload) =>
    jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" }), 
  verifyToken: (token) => jwt.verify(token, JWT_SECRET),
};

module.exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.authToken; // Retrieve token from the cookie
    // console.log("Token:", token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }
    // if (!role) {
    //   return res
    //     .status(401)
    //     .json({ message: "Access denied. No role provided." });
    // }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add user data to request object
    var User = null;
    if (req.user.role === "Contractor") {
      User = await ContractorUser.findById(req.user.id);
    } else if (req.user.role === "Contractee") {
      User = await ContracteeUser.findById(req.user.id);
    }
    if (!User) {
      return res.status(404).json({ message: "User not found." });
    }
    // console.log("user Data ->" + User);
    if (
      req.path != "/verifyContractorEmail" &&
      req.path != "/verifyContracteeEmail" &&
      req.path != "/resendContractorVerificationMail" &&
      req.path != "/resendContracteeVerificationMail"
    ) {
      if (!User.emailVerified) {
        return res.status(400).json({ message: "Email not verified." });
      }
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
