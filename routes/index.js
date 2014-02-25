var parsers = require('../config.js').parsers,
    Movies = require('../models/movies.js');

exports.index = function(req, res){
    var model = null,
        title = 'Кино клуб',
        user = {},
        movieId = req.params.movieid,
        data = {};

    if (movieId){
        Movies.GetById(movieId, singleMovieCallback)
    } else singleMovieCallback(false);

    function singleMovieCallback(err, movie){
        if (movie){
            data['selectedMovie'] = movie;
        }

        if (res.locals.auth) {
            user = res.locals.user;
            Movies.GetByUser(res.locals.user.id, callback);
        }
        else Movies.GetAll(callback);
    }

    function callback(err, movies){
        data['title'] = title;
        data['model'] = {
            user: user,
            parsers: parsers
        };
        data['path'] = req.protocol + "://" + req.get('host') + req.url;

        if (!err){
            data.model.movies = movies;                                         
        }

        data.model = JSON.stringify(data.model);
        res.render('index', data);        
    }
};