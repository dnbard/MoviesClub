var mongoose = require('mongoose');

var moviesSchema = mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    date: String,
    owner: String
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
                desc: movie.desc,
                image: movie.image,
                id: movie._id
            })
        }

        callback(null, array);
    });
}

var addMovie = function(movie, user, callback){
    var ent = new Movies();
    ent.name = movie.title;
    ent.image = movie.image;
    ent.desc = movie.description;
    ent.owner = user.id;
    ent.save(callback);
}

exports.Movies = Movies;
exports.GetAll = getAll;
exports.Add = addMovie;