const path = require('path');
const registerController = require('../controllers/register');
var express = require('express');
var router = express.Router();


router.get('/', registerController.getAddPassword);
router.post('/', registerController.postAddPassword);



module.exports = router;