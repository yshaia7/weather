const path = require('path');
const apiController = require('../controllers/api');

var express = require('express');
var router = express.Router();


router.get('/get-user-locations', apiController.getLocations);//gets all user saved locations from the data base
router.post('/add-Location', apiController.postAddLocation);//adds location to data base
router.delete('/delete-Location', apiController.deleteLocation);//deletes location from data base
router.delete('/delete-All-Locations', apiController.deleteAllLocations);//deletes all locations for specific user from data base



module.exports = router;