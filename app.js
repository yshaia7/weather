var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var Sequelize = require('sequelize')
var SequelizeStore = require('connect-session-sequelize')(session.Store);


var sequelize = new Sequelize({
  "dialect": "sqlite",
  "storage": "./session.sqlite"
});


var myStore = new SequelizeStore({
  db: sequelize
})

var utilsRouter = require('./routes/utils');
var indexRouter = require('./routes/index');
var passRouter = require('./routes/reg-pass');
var usrRouter = require('./routes/reg-usr');
var weatherRouter = require('./routes/weather');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'somerandonstuffs',
  store:myStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));

myStore.sync();


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
app.get('/reg-pass', utilsRouter);
app.get('/test', utilsRouter);
app.use('/', indexRouter);
app.use('/login', indexRouter);
app.use('/reg-pass', passRouter);
app.use('/reg-usr', usrRouter);
app.use('/weather', weatherRouter);
app.use('/api', (req, res, next) => {
  if(req.session.isLoggedIn)
    next();
  else
    res.redirect('/');
});
app.use('/api', apiRouter);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    title: 'error',
    errMessage: err});
});

module.exports = app;
