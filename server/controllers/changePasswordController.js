const bcrypt = require("bcrypt");
const { ContractorUser, ContracteeUser } = require("../models/User");


const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const role = req.user.role; // Assuming role is stored in JWT
        let UserModel;

        if (role === "Contractor") {
            UserModel = ContractorUser;
        } else if (role === "Contractee") {
            UserModel = ContracteeUser;
        } else {
            return res.status(400).json({ message: "Invalid role." });
        }

        const user = await UserModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if old password matches
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect." });
        }

        // Hash new password
        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(newPassword, salt);

        // Save the updated password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully." });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
};

module.exports = { changePassword };
