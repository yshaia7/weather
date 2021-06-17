const path = require('path');
const weatherController = require('../controllers/weather');

var express = require('express');
var router = express.Router();


router.get('/', weatherController.getWeather);
//router.post('/', weatherController.postWeather);



module.exports = router;