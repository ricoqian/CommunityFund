var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
	    res.render('login',{title:'Login Page'});
		});

module.exports = router;
