// passport config
var passport = require('passport');

// import the local strategy from 'passport-local' node module
var LocalStrategy = require('passport-local').Strategy;

// need the user model to control access
var User = require('../models/user.js');

// store a user object in the session as a string
passport.serializeUser(function(user, done){
	done(null, user.id);
});

// convert the serilized user string back into an object
passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user);
	});
});

// create a localStrategy object for passport to use for authentication
var localStrategy = new LocalStrategy(function(username, password, done){
	// search for the username and do something
	User.findOne({username: username}, function(err, user){
		// if an error happens, return done with an error
		if(err) {
			return done(err);
		};
		// if the user is not found (falsey), return done with parameters indicating the user wasn't found
		if(!user) {
			return done(null, false);
		};
		// if the user is found and no error occured, call comparePassword. this method was created in ./models/user.js
		user.comparePassword(password, function(err, isMatch){
			if(err) {
				return done(err);
			}
			// if a match is found, return done with the user object
			if(isMatch){
				return done(err, user);
			}
			// if no error occurs but the password doesn't match, return done with no error and false match
			else {
				return done(null, false);
			};
		});
	});
});

// tell passport to use the local strategy defined above
passport.use(localStrategy);

module.exports = {
	ensureAuthenticated : function(req, res, next){
		// if the current user is logged in
		if(req.isAuthenticated()){
			// allow route execution chain to continue
			return next();
		};
		// if not, redirect to login page
		res.redirect('/auth/login');
	}
};