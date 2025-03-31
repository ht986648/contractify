const { ContractorUser, ContracteeUser } = require("../models/User");
const { sendVerificationEmail } = require("./sendVerificationMailController");

exports.resendContractorVerificationMail = async (req, res) => {
    const user = await ContractorUser.findById(req.user.id).select('-password'); // Exclude sensitive data like password

    try {
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if (user.emailVerified){
            return res.status(400).json({ message: 'Email already verified.' });
        }
        const OTP = user.emailVerificationToken
        const email = user.email
        const emailSent = await sendVerificationEmail(email, OTP);
        if (emailSent) {
            return res.status(200).json({
                success: true,
                message: "OTP resent successfully.",
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP. Please try again.",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
            error: error.message,
        });
    }


}

exports.resendContracteeVerificationMail = async (req, res) => {
    const user = await ContracteeUser.findById(req.user.id).select('-password'); // Exclude sensitive data like password

    try {
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if (user.emailVerified){
            return res.status(400).json({ message: 'Email already verified.' });
        }
        const OTP = user.emailVerificationToken

        const email = user.email
        const emailSent = await sendVerificationEmail(email, OTP);
        if (emailSent) {
            return res.status(200).json({
                success: true,
                message: "OTP resent successfully.",
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP. Please try again.",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
            error: error.message,
        });
    }


}
