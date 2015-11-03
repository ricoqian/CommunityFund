var express = require('express');
var router = express.Router();




var articles = require('./articles');

var tags = require('./tags');
var fs = require('fs');
var mongoose = require('mongoose');

var bCrypt = require('bcrypt-nodejs');

var User = mongoose.model('user');
var auth = require('./authorization');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/login', function (req, res) {
    if (req.user) res.redirect('/userhomepage');
    	    // Display the Login page with any flash message, if any
    else res.render('login', {
        //message: req.flash('message')
    });
});

/* Handle login POST */
router.post('/users/session', 
        passport.authenticate('local', {
    //login is a strategy name which is set by passport.use 
    successRedirect: '/userhomepage',
    failureRedirect: '/login',
    failureFlash : true
}),
        function (req, res) {
    //session
    var redirectTo = req.session.returnTo ? req.session.returnTo : '/';
    delete req.session.returnTo;
    res.redirect(redirectTo);
    //test session
    var sess = req.session
    if (sess.views) {
        sess.views++
        res.setHeader('Content-Type', 'text/html')
        console.log('views: ' + sess.views)
           
    } else {
        sess.views = 1
        console.log('welcome to the session demo. refresh!')
    }
}
);

/* GET signup Page */
router.get('/signup', function (req, res) {
    res.render('register', { message: req.flash('message') });
});


/* Handle signup POST */
router.post('/signup', function (req, res, next) {
    
    //validation
    req.assert('email', 'Email is not valid').isEmail();
    //req.assert('password', 'Password must be at least 4 characters long').len(4);
    //req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    
    var errors = req.validationErrors();
    if (errors) {
        //TODO: check other errors
        //req.flash('errors', errors);
        req.flash('message', 'Email is not valid');
        res.redirect('/signup');
            //console.log(errors);
    }
    else {
        User.findOne({ 'email': req.body.email }, 
                function (err, existingUser) {
            if (existingUser) {
                req.flash('message', 'Account with that email address already exists.');
                //console.log('Account with that email address already exists.');    
                res.redirect('/signup');
            }
            else {
                
                var user = new User({
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                          
                });
                
                user.save(function (err) {
                    if (err) return next(err);
                    req.logIn(user, function (err) {
                        if (err) return next(err);
                        //console.log('User Registration succesful');
                        res.redirect('/home');
                    });
                    
               
                });
            }//else
        }//function
        );

    }//else

});
    
module.exports = router;
