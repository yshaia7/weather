const db = require('../models');
const utils = require('../utils/utils');


//this file is the controller for the registration portion

//get the user registration page
exports.getAddUser = (req, res) => {
    res.render('register/reg-user', {
        title: 'register',
        errMessage: ''});
};


//checks if user email is valid and exists, moves on to password registration
exports.postAddUser = async (req, res, next) => {
    let check = await db.User.findOne({where: {email: req.body.email}})
        .catch(usr =>  {
        res.render('register/reg-user', {
            title: 'register',
            errMessage: 'Something went wrong try again'});
    });
    if(check == null)
    {
        utils.setPasswordTimout(req, res);//sets expiration to 60 seconds
        req.session.email = req.body.email;
        req.session.startReg = true;
        res.redirect('/reg-pass');
    }
    else //email is taken
    {
        res.render('register/reg-user', {
            title: 'Register',
            errMessage: 'The email: ' + req.body.email + ' is taken'});
    }
};

//gets password registration view, if not part of registration it goes to login page
exports.getAddPassword = async (req, res, next) => {
    if(!req.session.startReg)
        res.redirect('/login');
    else
        res.render('register/reg-password', {
            title: 'register',
            errMessage: ''});
};

//sets password for user
exports.postAddPassword = async (req, res, next) => {
    let check = utils.getPasswordTimeout(req, res);
    if(!check)//checks if session timed out
    {
        res.render('register/reg-user', {
            title: 'Register',
            errMessage: 'Session expired, you must complete registration within 60 seconds'});
        return;
    }

    //validates password, adds to the user
    let check_pass = req.body.firstPassword == req.body.secondPassword;
    let check_mail = await db.User.findOne({where: {email: req.session.email}});

    if(check_mail)
        res.render('register/reg-user', {
            title: 'Register',
            errMessage: 'The email: ' + req.session.email + ' is taken'});

    if(check_pass)//adds user to the data base
    {
        const createUser = db.User.create({email: req.session.email, firstName: req.session.firstName, lastName: req.session.lastName, password: req.body.secondPassword});
        res.render('login', {
            title: 'login',
            errMessage: '',
            registered: "Registered User successfully"});
    }
    else
    {
        res.render('register/reg-password', {
            title: 'register',
            errMessage: 'Passwords do not match, try again'});
    }
};