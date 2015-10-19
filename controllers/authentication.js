var passport = require('passport');

var User = require('../models/user');


// utility function to abstract out actual login process, requires user model
var performLogin = function(req, res, next, user){
	// passport injects a .login method to express reqs.
	req.login(user, function(err){
		// if an error occurs, allow execution to move to next route handler middleware
		if (err){
			return next(err);
		};
		// if passport login is successful, redirect the user to home page
		return res.redirect('/');
	});
};

// here's the big authentication controller object
var authenticationController = {
	// first route to handle is user login
	login: function(req, res) {
		// send the user to the login.html file
		res.sendFile('/html/login.html', {root: './public'})
	},

	// route is to handle incoming login attempts
	processLogin: function(req, res, next){
		// passport's authenticate method returns a method, store it. indicate which strategy
		var authFunction = passport.authenticate('local', function(err, user, info){
			// if an error happens
			if (err){
				return next(err);
			};
			// if the user is not found
			if (!user){
				return res.send({error: 'Error logging in. Please try again.'});
			};
			// if the user is found and no error occurs, attempt login process.
			performLogin(req, res, next, user);
		});
		// call the authFunction just created
		authFunction(req,res,next);
	},

	// try to create a new user in the database, relies on mongoose to throw duplication errors
	// if new user is successfully created, they are automatically logged in
	processSignup: function(req, res, next){
		// create a new instance of the User model with data passed to this handler
		var user = new User({
			username : req.body.username,
			password : req.body.password,
			email    : req.body.email
		});
		// attempt to save user to database (remembering the method will be intercepted and the pre check will run first)
		user.save(function(err, user){
			if(err){
				// mongoose duplicate key error
				if(err.code === 11000){
					return res.send({error: 'this user already exists'});
				}
				// generic error
				else{
					return res.send({error: 'an error occured, please try again'});
				};
			};
			performLogin(req, res, next, user);
		});
	},

	// handle logout requests
	logout: function(req, res){
		// passport inject a logout function to call
		req.logout();
		res.redirect('/auth/login');
	}
};

module.exports = authenticationController;