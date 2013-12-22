
/*
 * GET home page.
 */

exports.index = function(req, res){
    var Movies = require('../models/movies.js').Movies;
    var model = null;

    Movies.find({}, {
        _id:0
    }).lean().exec(function(err, movies){
        if (!err){
            res.render('index',
                {
                    title: 'Movies Club23',
                    movie: movies
                });
        } else {
            res.render('index',
                {
                    title: 'Movies Club23'
                });
        }
    });
};