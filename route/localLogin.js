var User = require('../models/user');
var tokenGenerator = require('./tokenGenerator');

exports.localLogin = function(req, res) {
	console.log("Local Login: User attempted to login. Checking request information: " + req.body.username);
	User.findOne({
		username: req.body.username
	}, function(err, user) {
		if(!user) {
			console.log("Local Login: Checking database for user. Search returned: " + user);
			return res
							.status(401)
							.send({
								message: 'Invalid email and/or password'
							});
		}

		user.comparePassword(req.body.password, function(err, isMatch) {
			if(!isMatch) {
				console.log("Local Login: Login failed. Password was incorrect, comparison returned: " + isMatch);
				return res
					.status(401)
					.send({
						message: 'Invalid email and/or password'
					});
			}
			var generatedToken = tokenGenerator.generateToken(user);
			console.log("Local Login: Login successful. Generating token: " + generatedToken);
			res.send({
				token: generatedToken
			});
		});
	})
};