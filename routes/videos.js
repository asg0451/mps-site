var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
    res.render('videos', { title: 'Strats in action',
                          pageName: 'vids'});
});

module.exports = router;
