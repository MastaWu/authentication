var auth = require('express').Router();
var login = require('./localLogin');
var signup = require('./localSignup');
var google = require('./googleLogin');
var ensureAuthentication = require('./ensureAuthentication');

auth.get('/', ensureAuthentication.checkAuthorization, function(req, res) {
	res.send("Hello");
});

auth.post('/signup', signup.localSignup);
auth.post('/login', login.localLogin);
auth.post('/google', google.googleLogin);

module.exports = auth;
