var express = require('express');
var router = express.Router();
var db = require('../db');

/* POST item. */
router.post('/', function (req, res) {
    req.body.user_id = req.session.passport.user.id;
    db.connection().query('INSERT INTO item SET ?', req.body, function (err, result) {
        if (err) {
            res.send(500);
        } else {
            req.body.id = result.insertId;
            res.status(201).json(req.body);
        }
    });
});

module.exports = router;