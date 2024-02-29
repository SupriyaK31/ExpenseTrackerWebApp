const express = require('express');

const resetpasswordController = require('../controllers/forgetPassController');
const { route } = require('./userRoute');


const router = express.Router();

router.get('/forgetPass',resetpasswordController.getforgetPage);

router.get('/updatepassword/:resetpasswordid', resetpasswordController.updatepassword)

router.get('/resetpassword/:id', resetpasswordController.resetpassword)

router.use('/forgotpassword', resetpasswordController.forgotpassword)

module.exports = router;