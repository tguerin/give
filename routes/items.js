var express = require('express');
var router = express.Router();

/* POST item. */
router.post('/', function (req, res, next) {
    // TODO: save item and return it.
    res.status(201).json({id: 1});
});

module.exports = router;
