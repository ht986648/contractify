const { ContractorUser, ContracteeUser } = require("../models/User");

const editContractorProfile = async (req, res) => {
  try {
    // Fetch the user from the database
    const user = await ContractorUser.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the user's profile with data from the request body
    const { name, dob, gender, address, pincode, city, state } = req.body;

    if (!name || !dob || !gender || !address || !pincode || !city || !state) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }
    const formattedDob = new Date(dob);

    if (isNaN(formattedDob.getTime())) {
      return res.status(400).json({ message: "Invalid Date of Birth format." });
    }

    user.name = name;
    user.dob = formattedDob;
    user.gender = gender;
    user.address = address;
    user.pincode = pincode;
    user.city = city;
    user.state = state;

    // Save the updated user profile
    await user.save();

    res.status(200).json({ message: "Profile updated successfully.", user });
  } catch (error) {
    console.error("Error completing profile:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }

    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const editContracteeProfile = async (req, res) => {
  try {
    // Fetch the user from the database
    const user = await ContracteeUser.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the user's profile with data from the request body
    const { name, dob, gender, address, pincode, city, state } = req.body;

    if (!name || !dob || !gender || !address || !pincode || !city || !state) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }
    const [day, month, year] = dob.split("-");
    const formattedDob = new Date(`${year}-${month}-${day}T00:00:00Z`);

    user.name = name;
    user.dob = formattedDob;
    user.gender = gender;
    user.address = address;
    user.pincode = pincode;
    user.city = city;
    user.state = state;

    // Save the updated user profile
    await user.save();

    res.status(200).json({ message: "Profile updated successfully.", user });
  } catch (error) {
    console.error("Error completing profile:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }

    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = { editContractorProfile, editContracteeProfile };
