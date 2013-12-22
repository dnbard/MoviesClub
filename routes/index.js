
/*
 * GET home page.
 */

exports.index = function(req, res){
    var Movies = require('../models/movies.js');
    var model = null;

    Movies.GetAll(function(err, movies){
        if (!err){
            res.render('index',
                {
                    title: 'Movies Club23',
                    movie: JSON.stringify(movies)
                });
        } else {
            res.render('index',
                {
                    title: 'Movies Club23'
                });
        }
    });
};