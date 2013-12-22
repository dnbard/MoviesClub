var db = require('../database.js'),
    mongoose = require('mongoose');

var moviesSchema = mongoose.Schema({
    name: String,
    image: String,
    date: String
});

var Movies = mongoose.model('Movies', moviesSchema);
exports.Movies = Movies;
