var Users = require('../models/users.js'),
    utils = require('../utils.js'),
    Movies = require('../models/movies.js'),
    Articles = require('../models/articles.js');

var sendNotAuth = function(req, res){
    res.send({
        result: false,
        msg: "User is not authorised"
    });
}

exports.login = function(req, res){
    var name = req.query.n;
    var pass = req.query.p;

    Users.Find(name, pass, 
        function(user){
            res.cookie(
                'uid', 
                user.token, 
                { 
                    maxAge: 2592000000, 
                    httpOnly: false
                });
            res.send({
                user: {
                    name: user.name,
                    token: user.token
                },
                result: true,
                msg: 'Ok'
            });
        }, function(){
            sendNotAuth(req, res);            
    });    
}

exports.add = function(req, res){
    if(res.locals.auth) {
        var url = req.body.url;
        if (url && utils.isValidUrl(url)){
            var parser = require('../parser/main.js');
            parser.parse(url, function(movie){                
                Movies.Add(movie, res.locals.user, function (err, movieEnt) {
                    if (err) res.send({
                        result: false, 
                        msg: err
                    }); 
                    else {
                        Articles.addMovieMessage(res.locals.user, movieEnt);
                        res.send({
                            result: true, 
                            msg: utils.format('Movie "{0}" added successfully')
                        }); 
                    }
                });                
            }, 
            function(){
                res.send({
                    result: false,
                    msg: 'Provided URL isn\'t valid.'
                });
            });
        } else res.send({
            result: false,
            msg: 'Provided URL isn\'t valid.'
        });
    }
    else res.send(false);
}

exports.get = function(req, res){
    if (res.locals.auth){
        Movies.GetByUser(res.locals.user.id, function(err, movies){
            res.send({
                result: true,
                movies: movies
            });
        });
    }
    else sendNotAuth(req, res);
}

exports.getall = function(req, res){
    if (res.locals.auth){
        Movies.GetAll(function(err, movies){
            res.send({
                result: true,
                movies: movies
            });
        });
    }
    else sendNotAuth(req, res);
}

exports.delete = function(req, res){
    if (res.locals.auth){
        var movieid = req.body.movie;
        Movies.Delete(movieid, res.locals.user.id,
        function(){
            res.send({result: true})
        }, function(){
                res.send(false);
            });
    } else sendNotAuth(req, res);
}

exports.watch = function(req, res){
    if (res.locals.auth){
        var movieId = req.body.movie,
            userId = res.locals.user.id;
        Movies.ToggleWatch(movieId, userId, function(err, state){
            if (err) {
                res.status(400).send();
            } else {
                if (state) {
                    Movies.GetById(movieId, function(err, movie){
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            Articles.addMovieWatchedMessage(res.locals.user, movie);
                            res.send({ result: true });
                        }
                    });
                } else {
                    Articles.removeMovieWatchedMessage(res.locals.user, movieId, function(){
                        res.send({ result: true });
                    });
                }
            }
        });

    } else sendNotAuth(req, res);
}

exports.getArticles = function(req, res){
    Articles.getAll(function(err, articles){
        if (err){
            res.status(500).send(err);
        } else {
            res.send({result: true, articles: articles});
        }
    })
}