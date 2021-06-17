const path = require('path');
const utilsController = require('../utils/utils');

var express = require('express');
var router = express.Router();


router.get('/reg-pass', utilsController.checkReg);
router.get('/test', utilsController.checkLogged);




module.exports = router;