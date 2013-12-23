var mongoose = require('mongoose');

var usersSchema = mongoose.Schema({
    login: String,
    password: String,
    token: String
});

var Users = mongoose.model('Users', usersSchema);

exports.Users = Users;