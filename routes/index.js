const path = require('path');
const loginController = require('../controllers/login');

var express = require('express');
var router = express.Router();


router.get('/', loginController.getLogin);//gets login page
router.post('/login', loginController.postLogin);//logs users in
router.post('/', loginController.postLogin);//logs users in



module.exports = router;