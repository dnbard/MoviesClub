var mongoose = require('mongoose');

var moviesSchema = mongoose.Schema({
    name: String,
    image: String,
    date: String
});

var Movies = mongoose.model('Movies', moviesSchema);

var getAll = function(callback){
    Movies.find(function(err, movies){
        var array = [];
        for(var i = 0; i < movies.length; i++){
            var movie = movies[i];
            array.push({
                name: movie.name,
                date: movie.date,
                image: movie.image,
                id: movie._id
            })
        }

        callback(null, array);
    });
}

exports.Movies = Movies;
exports.GetAll = getAll;
