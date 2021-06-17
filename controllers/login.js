const db = require('../models');

//this file is the controller for the login route

//this function returns the login page unless the user is logged in
exports.getLogin = (req, res) => {
    if (req.session.isLoggedIn) {
        res.redirect('/weather');
    }
    else
    {
        res.render('login', {
            title: 'login',
            errMessage: '',
            registered: ''});
    }

};


//this function handles logging into the system
exports.postLogin = async (req, res, next) => {
    //checks if user exists
    await db.User.findOne({where: {email: req.body.email}})
        .then(usr => {
            //checks if password matches
            if(usr.dataValues.password == req.body.password)
            {
                req.session.isLoggedIn = true;
                req.session.f_name = usr.dataValues.firstName;
                req.session.l_name = usr.dataValues.lastName;
                req.session.email = usr.dataValues.email;
                req.session.id = usr.dataValues.id;
                res.redirect('/weather');
            }
            else //wrong password
            {
                res.render('login', {
                    title: 'login',
                    errMessage: 'Wrong password',
                    registered: ''});
            }
        })
        .catch(usr =>  { //in case user does not exist
            res.render('login', {
                title: 'login',
                errMessage: 'User does not exist',
                registered: ''});
        });


};
