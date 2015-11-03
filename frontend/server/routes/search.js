
var express = require('express');
var router = express.Router();

router.get('/search',function(req,res,next){
	  	  res.render('search',{title:'Search Page'});
		  });


module.exports = search;

