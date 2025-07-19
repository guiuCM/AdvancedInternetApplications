var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var Handlebars = require('handlebars');
var expressHandlebars = require('express-handlebars');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

var indexRouter = require('./routes/index');

var app = express();

mongoose.connect('mongodb://localhost:27017/shop', {useNewUrlParser: true, useUnifiedTopology: true});

app.engine('.hbs', expressHandlebars({helpers: {
    gt: function(options) {
      console.log(options);
    },
    lt: function(options) {

    }
  }, defaultLayout: 'layout', extname: '.hbs', handlebars: allowInsecurePrototypeAccess(Handlebars)}));

// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false,
  sourceMap: true
}));
app.use(session({
    secret: 'mysupersecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(function(req, res, next) {
    req.session.cookie.maxAge = 3 * 60 * 60 * 1000;
    next();
});

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
