const mongoose = require("mongoose");
const Contract = require("../models/Contract");


const updateContractStatusToExpired = async(req, res)=>{
    try {
        const  email  = req.user.email;
        let query = {
            $or: [{ contractorEmail: email} , { contracteeEmail: email}]
          };
        const contract = await Contract.find(query);
        if (!contract) {
            return res.status(404).json({ message: "Contract not found." });
        }
        const currentDate = new Date();
        contract.forEach(async (contract) => {
            if (currentDate > contract.endDate) {
                contract.status = "Expired";
                await contract.save();
            }
        });
        res.status(200).json({ message: "Contract status updated to expired." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = { updateContractStatusToExpired };