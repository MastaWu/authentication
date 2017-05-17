var bcrypt = require('bcryptjs');
var User = require('../models/user');
var userRole = require('../models/userRole');
var tokenGenerator = require('./tokenGenerator');

exports.localSignup = function(req, res) {
	User.findOne({
		username: req.body.username
	}, function(err, existingUser) {
		if (existingUser) {
			console.log("Sign-up: Username is already taken.");
			return res.status(409).send({message: 'Username is already taken.'});
		}
		console.log("Sign-up: Body: " + JSON.stringify(req.body));
		console.log("Sign-up: Username is not taken: " + req.body.username);
		var user = new User({
			username: req.body.username,
			password: req.body.password,
			email: req.body.email,
			role: userRole.user
		});
		console.log("Sign-up: User: " + user);

		user.save(function(err) {
			if (err) {
				console.log("Sign-up: User already exists. Returning 500 code");
				res.status(500).send({message: err.message});
			}
			console.log("Sign-up: Giving token to user.");

			User.find(function(err, user) {
				if (err) {
					throw err;
				}
				console.log("Sign-up: Response from query: " + user);
				var generatedToken = tokenGenerator.generateToken(user);
				console.log("Sign-up: Generated token: " + generatedToken);
				console.log("Sign-up: Finished.");
				res.json({token: generatedToken});
			});
		})
	})
};
