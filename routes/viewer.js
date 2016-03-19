var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
    fs.readdir(__dirname + '/../map_dir/maps/', function(err, maps) {
        console.log(err);
        res.render('viewer', { title: 'R6 Maps v2',  maps: maps});

    });

});

module.exports = router;
