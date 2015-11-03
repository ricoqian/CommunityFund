


exports.login('/login', 
        function (req, res) {
    if (req.user) res.redirect('/home');
    	    // Display the Login page with any flash message, if any
    else res.render('index', {
        message: req.flash('message')
    });
});

/* Handle login POST */
exports.post('/users/session', 
        passport.authenticate('local', {
    //login is a strategy name which is set by passport.use 
    successRedirect: '/index',
    failureRedirect: 'users/login',
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

exports.param('userId', 
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

exports.get('/users/:userId', function (req, res) {
    var user = req.profile;
    
    User.findOne({ '_id': user._id }, function (err, existingUser) {
        if (err)        ;//return error
        if (existingUser) {
            console.log(existingUser);
            res.render('home', {
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
exports.get('/signup', function (req, res) {
    res.render('register', { message: req.flash('message') });
});


/* Handle signup POST */
exports.post('/signup', function (req, res, next) {
    
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


/* GET Home Page */
exports.get('/home', isAuthenticated, function (req, res) {
    res.render('home', { user: req.user });
});




/* Handle Logout */
exports.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});