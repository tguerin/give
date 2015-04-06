var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var uuid = require('node-uuid');
var passport = require('passport');

var auth = require('./routes/authentication');
var items = require('./routes/items');
var images = require('./routes/images');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

app.use('/auth', auth);
app.use(multer({
    dest: './public/upload/',
    rename: function (fieldname, filename) {
        return uuid.v1() + path.extname(filename);
    }
}));
app.use('/items', items);
app.use('/images', images);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
