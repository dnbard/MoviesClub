var parsers = require('../config.js').parsers,
    Movies = require('../models/movies.js');

exports.index = function(req, res){
    var model = null,
        title = 'Кино клуб',
        user = {};

    if (res.locals.auth) {
        user = res.locals.user;
        Movies.GetByUser(res.locals.user.id, callback);
    }
    else Movies.GetAll(callback);

    function callback(err, movies){
        var data = {
            title: title, 
            model: {
                user: user,
                parsers: parsers
            }          
        };

        if (!err){
            data.model.movies = movies;                                         
        }

        data.model = JSON.stringify(data.model);
        res.render('index', data);        
    }
};