const Cookies = require('cookies');
const keys = ['keyboard cat']


//
exports.getPasswordTimeout = function (req,res)
{

    let cookies = new Cookies(req, res, {keys: keys});
    let timeOut = cookies.get('TimeOut', { signed: true });

    if(!timeOut)
        return false;
    return true;
}

exports.setPasswordTimout = function (req,res)
{

    let cookies = new Cookies(req, res, { keys: keys });
    let timeOut = cookies.get('TimeOut', { signed: true });

    if(!timeOut)
    {
        cookies.set('TimeOut', new Date().toISOString(),
            { signed: true, maxAge: 60*1000 });
    }
}

exports.checkLogged = function (req, res, next)
{
    if (!req.session.isLoggedIn)
        res.redirect('/login');
    next();
}

exports.checkReg = function (req, res, next)
{
    if (!req.session.startReg)
        return res.redirect('/login');
    next();
}

