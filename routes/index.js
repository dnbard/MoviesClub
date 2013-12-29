
/*
 * GET home page.
 */

exports.index = function(req, res){
    var Movies = require('../models/movies.js');
    var model = null;
    var title = 'Кино клуб';

    Movies.GetAll(function(err, movies){
        if (!err){
            res.render('index',
                {
                    title: title,
                    movie: JSON.stringify(movies)
                });
        } else {
            res.render('index',
                {
                    title: title
                });
        }
    });
};