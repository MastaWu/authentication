var config = require('../config');
var jwt = require('jsonwebtoken');

exports.checkAuthorization = function(request, response, next) {
	if (!request.header('Authorization')) {
		console.log("EnsureAuthentication: User does not have an Authorization header.");
		return response
							.status(401)
							.send({
							message : 'You are unauthorized to access this page.'
						});
	}

	console.log("EnsureAuthentication: Request Authorization Header: " + JSON.stringify(request.header('Authorization')));
	var token = request.header('Authorization').split(' ')[1];
	console.log("EnsureAuthentication: Token from header: " + token);

	var payload = null;
	try {
		payload = jwt.decode(token, config.secret);
	} catch (err) {
		return response
						.status(401)
						.send({
							message: err.message
						});
	}

	if (payload.exp <= Date()) {
		console.log("EnsureAuthentication: User token has expired. Please retrieve another.");
		return response
						.status(401)
						.send({
							message: "Your token has expired."
						});
	}
	request.user = payload;
	console.log("EnsureAuthentication: User is valid! Payload: " + JSON.stringify(payload));
	console.log("EnsureAuthentication: User is valid! Request.user: " + JSON.stringify(request.user));
	next();
};