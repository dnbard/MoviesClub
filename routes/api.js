var Users = require('../models/users.js'),
    utils = require('../utils.js'),
    Movies = require('../models/movies.js');

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
            res.cookie('uid', user.token);
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
                Movies.Add(movie, res.locals.user, function (err) {
                    if (err) res.send({
                        result: false, 
                        msg: err
                    });
                    res.send({
                        result: true, 
                        msg: utils.format('Movie "{0}" added successfully')
                    }); 
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
        })
    } 
    else sendNotAuth(req, res);    
}