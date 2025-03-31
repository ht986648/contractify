const bcrypt = require("bcrypt");
const { ContractorUser, ContracteeUser } = require("../models/User");

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.body;
        const { newPassword , role } = req.body;
        console.log(req.body);
        console.log(new Date());
        let User;
        if (role === "contractor") {
            User = ContractorUser;
        }
        else if (role === "contractee") {
            User = ContracteeUser;
        }

        const user = await User.findOne({
            resetToken: token,
            // resetTokenExpiry: { $gt: new Date() } // Check if token is still valid
        });


        if (!user) {
            return res.status(400).json({ status: false, message: "Invalid token" });
        }
        if (user.resetTokenExpiry < new Date()) {
            return res.status(400).json({ status: false, message: "Token expired" });
        }

        // Hash new password
        user.password = newPassword;

        // Clear reset token
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        res.status(200).json({ status: true, message: "Password reset successful" });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ status: false, message: "Server error" });
    }
};
