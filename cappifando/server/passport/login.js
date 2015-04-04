var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

var User = mongoose.model('user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){
    passport.use( new LocalStrategy({
                usernameField:'email',
            passReqToCallback : true
        },
        function(req, email, password, done) { 
            // check in mongo if a user with email exists or not
            User.findOne({ 'email' :  email }, 
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log the error and redirect back
                    if (!user) {
                        console.log('User Not Found with username ' + email);
                        return done(null, false, req.flash('message' , 'User Not found.' ));                 
                    }
                    user.comparePassword(password, function (err, isMatch) {
                        if (isMatch) {// User and password both match, return user from done method
                            // which will be treated like success
                            return done(null, user);
                        } else {
                            return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                        }
                    });
                }
            );
        })
    );
    
}