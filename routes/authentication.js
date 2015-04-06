var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var db = require('../db');
var router = express.Router();


passport.use(new GoogleStrategy({
        clientID: process.env.authClientId,
        clientSecret: process.env.authClientSecret,
        callbackURL: process.env.authCallbackUrl,
        passReqToCallback: true
    },
    function (request, accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            db.connection().query('SELECT * FROM user WHERE email like ?', profile.email, function (err, rows) {
                if (err) {
                    return done(err, null);
                }
                if (!rows) {
                    db.connection().query("INSERT INTO user SET ?", {
                        email: profile.email,
                        name: profile.displayName,
                        googleId: profile.id
                    }, function (err, result) {
                        db.connection().query('SELECT * FROM user WHERE id = ?', result.insertedId, function (err, result) {
                            return done(null, result);
                        });
                    });
                } else {
                    return done(null, rows[0]);
                }
            });

        });
    }
));

// Redirect the user to Google for authentication.  When complete, Google
// will redirect the user back to the application at
//     /auth/google/return
router.get('/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read']
}));

// Google will redirect the user to this URL after authentication.  Finish
// the process by verifying the assertion.  If valid, the user will be
// logged in.  Otherwise, authentication has failed.
router.get('/google/return',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

router.get('/authenticated', ensureAuthenticated, function (req, res) {
    res.send(200);
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.send(401);
}


module.exports = router;