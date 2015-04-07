var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/:id/items', function (req, res) {
    if (req.session.passport.user && parseInt(req.params.id, 10) === req.session.passport.user.id) {
        db.connection().query('SELECT * FROM item WHERE user_id = ?', req.session.passport.user.id, function (err, result) {
            if (err) {
                res.send(500);
            } else {
                res.status(200).json(result);
            }
        });
    } else {
        res.status(200).json([]);
    }
});

module.exports = router;