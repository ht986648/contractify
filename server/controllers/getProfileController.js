// Import necessary modules
const { ContractorUser, ContracteeUser } = require("../models/User");

// Function to get user profile details
const getContractorProfile = async (req, res) => {
    try {
        
        console.log(req.user.id);
        const user = await ContractorUser.findById(req.user.id).select('-password'); // Exclude sensitive data like password

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Return the user details
        res.status(200).json({ message: 'Profile retrieved successfully.', user });
    } catch (error) {
        console.error('Error retrieving profile:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
        }

        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

const getContracteeProfile = async (req, res) => {
    try {
        
        console.log(req.user.id);
        const user = await ContracteeUser.findById(req.user.id).select('-password'); // Exclude sensitive data like password

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Return the user details
        res.status(200).json({ message: 'Profile retrieved successfully.', user });
    } catch (error) {
        console.error('Error retrieving profile:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
        }

        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = { getContractorProfile , getContracteeProfile };
