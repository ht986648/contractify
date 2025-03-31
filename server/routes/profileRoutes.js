const express = require('express');
const { editContractorProfile , editContracteeProfile } =  require('../controllers/editProfileController');
const { getContractorProfile  , getContracteeProfile } =  require('../controllers/getProfileController');
const { verifyToken } = require("../utils/jwtHelper");

const router = express.Router();

router.get('/getContractorProfile', verifyToken, getContractorProfile);
router.get('/getContracteeProfile', verifyToken, getContracteeProfile);
router.post('/editContractorProfile',verifyToken, editContractorProfile);
router.post('/editContracteeProfile',verifyToken, editContracteeProfile);


module.exports = router;