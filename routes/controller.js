var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/', function(req, res) { // why
    fs.readdir(__dirname + '/../map_dir/maps/', function(err, maps) {
        if(err) console.log(err);
        else res.render('controller', { title: 'R6 Maps v2 Controller',  maps: maps});

    });
});

module.exports = router;
