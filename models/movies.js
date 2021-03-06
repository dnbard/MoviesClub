var mongoose = require('mongoose'),
    Users = require('./users.js'),
    utils = require('../utils.js');

var moviesSchema = mongoose.Schema({
    name: {type:String, index: true},
    image: String,
    desc: String,
    date: {type:String, index: true},
    owner: {type:String, index: true},
    ratings:[{
        provider: String,
        rating: String
    }],
    genres: [String],
    watched: Boolean
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
            array.push(formatSingleMovie(movie, owner));
        }

        callback(array);
    });
}

function formatSingleMovie(movie, owner){
    return {
        name: movie.name,
        date: movie.date,
        desc: movie.desc,
        image: movie.image,
        owner: owner?owner:null,
        ownerId: movie.owner,
        id: movie._id,
        ratings: movie.ratings,
        genres: movie.genres,
        watched: movie.watched
    };
}

var getAll = function(callback){
    Movies.find({}, null, {sort: {_id: -1}}, function(err, movies){
        if (err) callback(err);

        FormatMoviesList(movies, function(moviesList){
            callback(null, moviesList);
        });
    });
}

var getAllInternal = function(callback){
    Movies.find({}, null, {sort: {_id: -1}}, function(err, movies){
        if (err) callback(err);

        callback(null, movies);
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
    ent.watched = false;
    ent.save(function(err)
    {
        callback(err, ent);
    });
}

var deleteMovie = function(id, userid, success, failure){
    Movies.findOne({owner: userid, _id: id}, function(err, movie){
        if (err || !movie) failure(err);
        else movie.remove(success);
    });
}

var toggleWatch = function(movieId, userId, result){
    Movies.findOne({owner: userId, _id: movieId}, function(err, movie){
        if (err) result(err);
        if (!movie) result(true);

        movie.watched = !movie.watched;
        movie.save();
        result(false, movie.watched);
    });
}

var getById = function(movieId, result){
    Movies.findOne({ _id: movieId}, function(err, movie){
        if (err) { result(err); return; }
        if (!movie) { result(true); return;}

        result(false, formatSingleMovie(movie));
    });
}

exports.Movies = Movies;
exports.GetAll = getAll;
exports.GetAllInternal = getAllInternal;
exports.GetByUser = getByUser;
exports.GetById = getById;

exports.Add = addMovie;
exports.Delete = deleteMovie;
exports.ToggleWatch = toggleWatch;