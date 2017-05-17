var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
    firstName        : String,
	  lastName         : String,
    email            : String,
    username    : { type: String, required: true, index: { unique: true } },
    password    : { type: String, required: true, selected: false },
    role         : String
});

userSchema.pre('save', function(next) {
    var user = this;
    
    if(!user.isModified('password')) {
        return next;
    }

    console.log("UserSchema: Saving user: " + JSON.stringify(user));

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (password, done) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);
