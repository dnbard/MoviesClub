var mongoose = require('mongoose'),
    Users = require('./users.js'),
    utils = require('../utils.js');

var moviesSchema = mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    date: String,
    owner: String,
    ratings:[{
        provider: String,
        rating: String
    }],
    genres: [String]
});

var Movies = mongoose.model('Movies', moviesSchema);


function GetOwnerName(users, userId){
    for(var i = 0; i < users.length; i ++){
        var user = users[i];
        if (user.id == userId)
            return user.name;
    }
    return null;
}

function FormatMoviesList(movies, callback){
    Users.GetAll(function(users){
        var array = [];
        for(var i = 0; i < movies.length; i++){
            var movie = movies[i];

            var owner = GetOwnerName(users, movie.owner);
            array.push({
                name: movie.name,
                date: movie.date,
                desc: movie.desc,
                image: movie.image,
                owner: owner,
                id: movie._id,
                ratings: movie.ratings,
                genres: movie.genres
            });
        }

        callback(array);
    });
}

var getAll = function(callback){
    Movies.find({}, null, {sort: {_id: -1}}, function(err, movies){
        if (err) callback(err);

        FormatMoviesList(movies, function(moviesList){
            callback(null, moviesList);
        });
    });
}

var getByUser = function(userId, callback){
    Movies.find({owner: userId}, null, {sort: {_id: -1}}, function(err, movies){
        if (err) callback(err);

        FormatMoviesList(movies, function(moviesList){
            callback(null, moviesList);
        });
    })
}

var addMovie = function(movie, user, callback){
    var ent = new Movies();
    ent.name = utils.stringNormalize(movie.title);
    ent.image = movie.image;
    ent.desc = utils.stringNormalize(movie.description);
    ent.owner = user.id;
    ent.ratings = movie.ratings;
    ent.genres = movie.genres;
    ent.save(callback);
}

var deleteMovie = function(id, userid, success, failure){
    Movies.findOne({owner: userid, _id: id}, function(err, movie){
        if (err || !movie) failure(err);
        else movie.remove(success);
    });
}

exports.Movies = Movies;
exports.GetAll = getAll;
exports.GetByUser = getByUser;

exports.Add = addMovie;
exports.Delete = deleteMovie;