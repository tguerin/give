var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');

/* POST item. */
router.post('/', function (req, res) {
    res.status(200).json({image: req.files.image.name});
});

module.exports = router;
