const crypto = require("crypto");
const { ContractorUser, ContracteeUser } = require("../models/User");
const nodemailer = require("nodemailer");

exports.forgotPassword = async (req, res) => {
    try {
        const { email, role } = req.body;
        let User;
        if (role === "contractor") {
            User = ContractorUser;
        }
        else if (role === "contractee") {
            User = ContracteeUser;
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry
        console.log(user.resetTokenExpiry);

        await user.save();

        // Create reset link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send email (Configure your SMTP settings)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`
        };

        await transporter.sendMail(mailOptions);
        console.log(resetToken);

        res.status(200).json({status: true, message: "Password reset link sent to your email." });

    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ status: false, message: "Server error" });
    }
};
