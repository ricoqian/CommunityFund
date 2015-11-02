var express = require('express');
var router = express.Router();




var home = require('./home');


var fs = require('fs');
var mongoose = require('mongoose');

var bCrypt = require('bcrypt-nodejs');

var User = mongoose.model('user');
var auth = require('./authorization');
var projects = require('./projects');
var individual = require('./individual');
var admin = require('./admin');
// Generates hash using bCrypt
var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function (passport){
    


    router.get('/', home.index);

	router.get('/admin/login', admin.renderlogin);
    router.get('/admin', admin.admin);
    router.post('/admin/login', admin.login);
    router.get('/admin/logout', function(req, res) {
		req.session.reset();
		req.flash('message', 'Successfully logged out.');
		res.redirect('/admin/login');
	});

    router.get('/contacts', function(req, res) {
        res.render('contacts', {
            user: req.user
        });
    });
      
    router.get('/login', 
        function (req, res) {
        if (req.user) res.redirect('/');
    	    // Display the Login page with any flash message, if any
        else res.render('users/login', {
            message: 'login error'
        });
    });

	/* Handle login POST */
    router.post('/users/session', 
        passport.authenticate('local', {
            //login is a strategy name which is set by passport.use 
		    successRedirect: '/',
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
                console.log('views: ' + sess.views )
           
            } else {
                sess.views = 1
                console.log('welcome to the session demo. refresh!')
            }
        }
    );
    
    router.param('userId', 
        function (req, res, next, id) {
            var options = {
                criteria: { _id : id }
            };
            User.load(options, function (err, user) {
                if (err) return next(err);
                if (!user) return next(new Error('Failed to load User ' + id));
                req.profile = user;
                next();
            });
    });

    router.get('/users/:userId', auth.requiresLogin, function (req, res) {
        var user = req.profile;
        //var user = req.session.user;
        console.log("????",user);
        User.findOne({ '_id': user._id }, function (err, existingUser) {
            if(err) ;//return error
            if (existingUser) {
                if (existingUser.community) {
                    User.find({ 'community' : existingUser.community, '_id' :{ "$ne": user._id}}, function (err, society) {
                       // console.log("existingUser", society);
                        res.render('users/profile', {
                            user: existingUser,
                            society: society
                        });
                                        
                    });
                }
                
            }
            else {
                //this user has been deleted
                ;
            }
        });
       
    });
    var extend = require('util')._extend;
    router.post('/users/:userId', isAuthenticated, function (req, res) {

        var user = req.user;
        user = extend(user, req.body);
        

        console.log("!!!!!!!!!!!!!",user);
        user.save(function (err) {
            if (!err) {
                return res.redirect('/users/' + user._id);
               // res.render('/users/:userId', {
                //    user: user

               // });
            }
            
            res.render('/users/:userId/editprofile', {
                user: user
                //errors: utils.errors(err.errors || err)
            });
        });

    });

    

    router.get('/users/:userId/editprofile', auth.requiresLogin,function (req, res) {
        var user = req.profile;
        
        User.findOne({ '_id': user._id }, function (err, existingUser) {
            if (err);//return error
            if (existingUser) {
                console.log("existingUser", existingUser);
                res.render('users/editProfile', {
                    user: existingUser
                });
            }
            else {
                //this user has been deleted
                ;
            }
        });
       
    });
    

	/* GET signup Page */
	router.get('/signup', function(req, res){
		res.render('users/signup',{message: req.flash('message')});
	});
    

    /* Handle signup POST */
    router.post('/signup', function (req, res,next) {
        
        //validation
        req.assert('email', 'Email is not valid').isEmail();
        //req.assert('password', 'Password must be at least 4 characters long').len(4);
        //req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

        var errors = req.validationErrors();
        if (errors) {
            //TODO: check other errors
            //req.flash('errors', errors);
            req.flash('message','Email is not valid');
            res.redirect('/signup');
            //console.log(errors);
        }
        else {
            User.findOne({ 'email': req.body.email }, 
                function (err, existingUser) {
                    if (existingUser) {
                        req.flash('message','Account with that email address already exists.' );
                        //console.log('Account with that email address already exists.');    
                        res.redirect('/signup');
                    }
                    else {
                
                    var user = new User({
                            firstname: req.body.firstname,
                            lasetname: req.body.lastname,
                            username: req.body.username,
                            password: req.body.password,
                            email: req.body.email,
                            community: req.body.community
                          
                        });

                         user.save(function (err) {
                            if (err) return next(err);
                            req.logIn(user, function (err) {
                                if (err) return next(err);
                                //console.log('User Registration succesful');
                                res.redirect('/');
                            });
                    
               
                        });
                    }//else
                 }//function
            );

        }//else

    });
    

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		res.render('home', { user: req.user });
	});
    

    router.get('/searchproject', projects.search);
    router.get('/searchproject/filter', projects.filter);
    

	/* Handle Logout */
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
    });
    router.param('id', individual.load);
    router.get('/inividual/story', individual.index);
    router.get('/individual/story/:id', individual.show);
    router.get('/startproj', auth.requiresLogin,projects.index);

    router.post('/subproj',projects.create);

    router.post('/individual/contribute/:id/rating', auth.requiresLogin, individual.rating);
    router.get('/individual/contribute/:id', individual.showCon);

    router.post('/individual/contribute/addCom/:id', individual.addCom);
    router.post("/individual/contribute/addMoni/:id", individual.addMoni);
    
    
  
	return router;
}




