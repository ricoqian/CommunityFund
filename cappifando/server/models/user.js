var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var crypto = require('crypto');

//var Schema = mongoose.Schema;

/**
 * User Schema
 */

var UserSchema = new mongoose.Schema({
    email: { type: String, default: '' },
    username: { type: String, default: '' },
    hashed_password: { type: String, default: '' },
    password: { type: String, default: '' },
    salt: { type: String, default: '' },
    authToken: { type: String, default: '' },


});


/**
 * Pre-save hook
 */


UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(5, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});


/**
 * Methods
 */

UserSchema.methods = {


  comparePassword : function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
   }


};

/**
 * Statics
 */

UserSchema.statics = {

  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  load: function (options, cb) {
    options.select = options.select || 'name username';
    this.findOne(options.criteria)
      .select(options.select)
      .exec(cb);
  }
}

mongoose.model('user', UserSchema);
