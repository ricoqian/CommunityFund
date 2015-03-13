var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/searchproject',function(req,res,next){
	  	  res.render('search',{title:'Search Page'});
		  });
router.get('/login', function(req, res, next) {
	    res.render('login',{title:'Login Page'});
		});
router.get('/signup', function(req, res, next) {
	    res.render('signup',{title:'Sign Up'});
		});
router.get('/contacts', function(req, res, next) {
	    res.render('contacts',{title:'Contacts'});
		});
router.get('/startproj', function(req, res, next) {
	    res.render('startproj',{title:'Startproj'});
		});

router.get('/individualproject/index', function(req, res, next) {
	    res.render('inindex',{title:'individualproject index'});
		});

router.get('/individualproject/contribute', function(req, res, next) {
	    res.render('contribute',{title:'contribute'});
		});

router.get('/individualproject/story', function(req, res, next) {
	    res.render('story',{title:'story'});
		});


module.exports = router;
