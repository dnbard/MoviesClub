
/*
 * GET home page.
 */

exports.index = function(req, res){
    var Movies = require('../models/movies.js');
    var model = null;
    var title = 'Кино клуб';
    var user = {};
    if (res.locals.auth) var user = res.locals.user;
    
    var parsers = require('../config.js').parsers;

    Movies.GetAll(function(err, movies){
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
    });
};