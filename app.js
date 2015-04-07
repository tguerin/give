var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var uuid = require('node-uuid');
var passport = require('passport');
var session = require('express-session');
var db = require('./db');

var auth = require('./routes/authentication');
var items = require('./routes/items');
var users = require('./routes/users');
var images = require('./routes/images');

var app = express();

app.use(session({
    genid: function (req) {
        return uuid.v1(); // use UUIDs for session IDs
    },
    resave: true,
    saveUninitialized: true,
    secret: 'keyboard cat'
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    db.connection().query('SELECT * FROM user WHERE id = ?', obj.id, function (err, rows) {
        if (err) {
            return done(err, null);
        }
        done(null, rows[0]);
    });
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
app.use('/users', users);

module.exports = app;
