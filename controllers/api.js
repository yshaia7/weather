const db = require('../models');
var express = require('express');


//This is the api controller file, handles api requests


//this function finds all the locations in the data base for a specific user and sends them.
exports.getLocations = async (req, res) => {
    let locations = await db.UserLocation.findAll({where: {email: req.session.email}});
    res.json(locations);
};

//this function adds a location to the data base for a specific user
exports.postAddLocation = async (req, res, next) => {
    await db.UserLocation.create({email: req.session.email, name: req.body.name, longitude: req.body.longitude, latitude: req.body.latitude});
};


//this function deletes a location from the data base for a specific user
exports.deleteLocation = async (req, res, next) => {
    await db.UserLocation.destroy({
        where: {
            name: req.body.name,
            email: req.session.email
        }
    });
};

//this function deletes all locations from the data base for a specific user
exports.deleteAllLocations = async (req, res, next) => {
    await db.UserLocation.destroy({
        where: {
            email: req.session.email
        }
    });
};