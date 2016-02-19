var express = require('express');
var router = express.Router();

/* GET about page. */

router.get('/', function(req, res) {
    res.render('about', { title: 'About the squad',
                          pageName: 'about'});
});

module.exports = router;
