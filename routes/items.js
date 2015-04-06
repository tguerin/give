var express = require('express');
var router = express.Router();
var db = require('../db');
var mailer = require('../mailer');

/* POST item. */
router.post('/', function (req, res) {
    req.body.user_id = req.session.passport.user.id;
    db.connection().query('INSERT INTO item SET ?', req.body, function (err, result) {
        if (err) {
            res.send(500);
        } else {
            req.body.id = result.insertId;
            res.status(201).json(req.body);
            mailer.sendMail({
                from: 'give.me.newsfeed@gmail.com',
                to: req.session.passport.user.email,
                subject: 'New item added',
                text: req.body.description
            }, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
        }
    });
});

module.exports = router;