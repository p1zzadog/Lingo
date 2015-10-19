var express = require('express');
var bodyParser = require('body-parser');

var routes = require('./routes/routes.js');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/LingoDB');

var session = require('express-session');
var passport = require('passport');
// passportConfig determines how passport runs and authenticates
var passportConfig = require('./config/passport.js')

var app = express();

app.use(session({
	secret            : 'secret',
	resave            : true,
	saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

// authenticationController handles authentication related routes
var authenticationController = require('./controllers/authentication.js');

app.get('/auth/login', authenticationController.login);
app.post('/auth/login', authenticationController.processLogin);
app.post('/auth/signup', authenticationController.processSignup);
app.get('/auth/logout', authenticationController.logout);

// this route will send back the logged in user object (or undefined if user is not logged in)
app.get('/api/me', function(req, res){
	res.send(req.user)
});

// this is the important part - all routes after this route will be behind authentication wall
app.use(passportConfig.ensureAuthenticated);

app.use('/', routes);
app.use('/page/translate', routes);
app.use('/page/quiz', routes);
app.use('/page/progress', routes);

app.use('/api/translation', routes);
app.use('/quiz/language-select', routes);
app.use('/quiz/get-next-question', routes);
app.use('/quiz/check-response', routes);
app.use('/quiz/cheatMode', routes)

var port = 3000;
app.listen(port, function(){
	console.log("console is listening on port...", port);
});