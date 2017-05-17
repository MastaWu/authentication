var express                     = require('express');
var app                         = express();
var bodyParser                  = require('body-parser');
var morgan                      = require('morgan');
var mongoose                    = require('mongoose');
var config                      = require('./config');
var port                        = 8080;

mongoose.connect(config.mongo);
mongoose.connection.on('error', function(err){
    console.log('Error: Could not connect to MongoDB: ' + err);
});
app.set('secret', config.secret);

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(morgan('dev'));


var auth = require("./route/index");

app.use('/api/auth', auth);

app.listen(port);
console.log('The server has started at port: ' + port);
