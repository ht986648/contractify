const { ContractorUser, ContracteeUser } = require("../models/User");

const nodemailer = require("nodemailer");

exports.verifyContractorEmail = async (req, res) => {
  try {
    console.log("Email verification Initialized..");

    console.log(req);
    const { email, code } = req.body;

    // Find user by email and verification code
    const user = await ContractorUser.findById(req.user.id);
    console.log(user);
    if (user.emailVerificationToken !== code) {
      return res
        .status(400)
        .json({ message: "Invalid verification code or email" });
    }

    console.log(user);

    // Verify user
    user.emailVerified = true;
    user.emailVerificationToken = null; // Clear the code after verification
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyContracteeEmail = async (req, res) => {
  try {
    console.log(req);
    const { email, code } = req.body;

    // Find user by email and verification code
    const user = await ContracteeUser.findById(req.user.id);
    console.log(user);
    if (user.emailVerificationToken !== code) {
      return res
        .status(400)
        .json({ message: "Invalid verification code or email" });
    }

    console.log(user);

    // Verify user
    user.emailVerified = true;
    user.emailVerificationToken = null; // Clear the code after verification
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
