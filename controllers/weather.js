const db = require('../models');

//get weather website for specific user
exports.getWeather = (req, res) => {
    if(!req.session.isLoggedIn)
        res.redirect('/login');
    else
        res.render('weather', {
            title: 'weather',
            userName: req.session.f_name});
};

/*exports.postWeather = async (req, res, next) => {

};*/

