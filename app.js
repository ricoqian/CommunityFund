var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');

var fs = require('fs');
var multer = require('multer');//for multipart
var methodOverride = require('method-override');//PUT DELETE
//models
require('./models/user');

require('./models/rating');
require('./models/project_model');
//mongoDB
var mongoose = require('mongoose');
// Connect to DB
mongoose.connect('mongodb://localhost/cappifando');
//'mongodb://<dbuser>:<dbpassword>@novus.modulusmongo.net:27017/<dbName>'


var app = express();







// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(multer({ dest: './public/images/' }))



var done = false;

/*Configure the multer.*/

app.use(multer({
    dest: './public/images/',
    rename: function (fieldname, filename) {
        
        return filename + Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
        done = true;
        inMemory: true

    }
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
// bodyParser should be above methodOverride
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use(cookieParser());

app.use(session({
	cookieName: 'session',
	secret: 'cnreiojewomehrybqiowjdfwdmqpcmrud13e4r3mocer54',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000, 
}));


// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
// TODO - Why Do we need this key ?
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());


// Initialize Passport
var confPassport = require('./passport/confPassport');
confPassport(passport);


//express-validator
var expressValidator = require('express-validator');
app.use(expressValidator());
//


//pass res to the jade
app.use(function (req, res, next) {
    res.locals.req = req;
    next();
});

//routes

var routes = require('./routes/index')(passport);

app.use('/', routes);

//*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
