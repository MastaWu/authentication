// https://github.com/sahat/satellizer/blob/master/examples/server/node/server.js
var bcrypt = require('bcryptjs');
var user = require('../models/user');
var userRole = require('../models/userRole');
var tokenGenerator = require('./tokenGenerator');
var request = require('request');
var config = require('../config');

exports.googleLogin = function(req, res) {
	var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
	var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
	var params = {
		code: req.body.code,
		client_id: req.body.clientId,
		client_secret: config.GOOGLE_SECRET,
		redirect_uri: req.body.redirectUri,
		grant_type: 'authorization_code'
	};

	request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token){
		var accessToken = token.access_token;
		var headers = { Authorization: 'Bearer ' + accessToken };

		request.get({ url: peopleApiUrl }, function(err, response, profile){
			if(profile.error) {
				console.log("GoogleLogin: There is an error with the user's profile.")
				return res.status(500).send({ message: profile.error.message });
			}

			if (req.header('Authorization')){
				user.findOne({ google: profile.sub }, function(err, existingUser){
					if(existingUser) {
						console.log("GoogleLogin: User already exists.");
						return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
					}
					var token = req.header('Authorization').split(' ')[1];
					// TODO: change token
					var payload = jwt.decode(token, config.secret);
					user.findById(payload.sub, function(err, user){
						if(!user){
							console.log("GoogleLogin: User does not exists.");
							return res.status(400).send({ message: 'User not found' });
						}
						user.google = profile.sub;
						user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
						user.username = user.username || profile.name;
						user.save(function(){
							var token = tokenGenerator.generateToken(user);
							res.send({ token: token });
						});
					});
				})
			} else {
				user.findOne({ google: profile.sub }, function(err, existingUser){
					if(existingUser){
						return res.send({token: tokenGenerator.generateToken(existingUser)});
					}
					var user = new User();
					user.google = profile.sub;
					user.picture = profile.picture.replace('sz=50', 'sz=200');
					user.username = profile.name;
					user.save(function(err){
						console.log("GoogleLogin: User has been successfully saved.");
						var token = tokenGenerator.generateToken(user);
						res.send({token: token});
					});
				});
			}
		});
	});
};
