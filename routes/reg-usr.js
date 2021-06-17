const path = require('path');
const usrController = require('../controllers/register');

var express = require('express');
var router = express.Router();


router.get('/', usrController.getAddUser);
router.post('/', usrController.postAddUser);


module.exports = router;