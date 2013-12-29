
/*
 * GET home page.
 */

exports.index = function(req, res){
    var Movies = require('../models/movies.js');
    var model = null;
    var title = 'Кино клуб';
    var user = {};
    if (res.locals.auth) {
        var user = res.locals.user;
    }

    Movies.GetAll(function(err, movies){
        if (!err){
            res.render('index',
                {
                    title: title,
                    model: JSON.stringify({
                        movies: movies,
                        user: user
                    })
                });
        } else {
            res.render('index',
                {
                    title: title
                });
        }
    });
};