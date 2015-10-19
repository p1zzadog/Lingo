// require bcrypt for password encryption, storing unencrypted passwords = bad thing
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose')
// create user schema with required fields. mongoose is already required where this schema will be invoked
var userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
});

// before saving a new user document, we have to encrypt the password
userSchema.pre('save', function(next){
	// first make sure the stored password hash hasn't been modified -- modified how??
	// maybe if the username or email or other document properties are being modified, you don't want to re-encrypt the password
	if(!this.isModified('password')) {
		return next();
	};

	// just for human readability
	var user = this;

	// generate salt to introduce more entropy to encryption function
	bcrypt.genSalt(10, function(err, salt){
		if(err) return next(err);
		bcrypt.hash(user.password, salt, function(err, hash){
			if(err) return next(err);
			user.password = hash;
			return next();
		});
	});
});

// creating a method on userSchema to allow bcrypt to hash a password attempt and compare the result with the stored hash.
userSchema.methods.comparePassword = function(candidatePassword, next){
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
		if(err) return next(err);
		return next(null, isMatch);
	});
};

var User = mongoose.model('user', userSchema);

module.exports = User;