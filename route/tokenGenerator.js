var userRoles = require('../models/userRole');
var config = require('../config');
var jwt = require('jsonwebtoken');

exports.generateToken = function(user) {
	console.log("TokenGenerator: Creating token.");
	console.log("TokenGenerator: User: " + JSON.stringify(user));
	console.log("TokenGenerator: Username: " + user[0].username);
	console.log("TokenGenerator: Role: " + user[0].role);

	var userDetails = {
		username: user[0].username,
		role: user[0].role
	};

	var tokenDetails = {
				algorithm: 'HS512',
				expiresIn: "10h",
				issuer: "authentication"
			};

	var generatedToken = jwt.sign(userDetails, config.secret, tokenDetails);
	console.log("TokenGenerator: Token created. " + generatedToken);
	return  generatedToken;
};