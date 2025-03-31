const express = require("express");
const {
  createContract,
  getContractsByEmail,
  acceptContract,
  rejectContract,
  generateContractPDF,
  signContractByContractor,
  signContractByContractee,
  saveSignature,
  downloadPDF,
  editContract,
  getContract,
} = require("../controllers/contractController");
const {
  updateContractStatusToExpired,
} = require("../controllers/contractStatusController");
const { verifyToken } = require("../utils/jwtHelper");
const router = express.Router();

router.post("/createContract", verifyToken, createContract);
router.put("/editContract/:contractId", verifyToken, editContract);
router.post("/signature", saveSignature);
router.get("/getContracts/:email", verifyToken, getContractsByEmail);
router.get("/getContract/:contractId", verifyToken, getContract);
router.get("/acceptContract/:id", acceptContract);
router.get("/rejectContract/:id", rejectContract);
router.put(
  "/signContract/contractor/:id",
  verifyToken,
  signContractByContractor
);
router.put("/signContractByContractee", verifyToken, signContractByContractee);
router.get("/generatePDF/:id", generateContractPDF);
router.get("/downloadPDF/:id", downloadPDF);
router.get(
  "/updateContractStatusToExpired",
  verifyToken,
  updateContractStatusToExpired
);

module.exports = router;
