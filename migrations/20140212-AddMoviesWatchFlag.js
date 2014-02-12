var movies = require('../models/movies.js');

exports.apply = function(migrationName, callback){
    movies.GetAllInternal(function(err, allMovies){
        if (err) throw err;

        allMovies.forEach(function(element){
            element.watched = false;
            element.save();
        });

        callback(migrationName);
    });
}
