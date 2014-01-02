var Users = require('../models/users.js').Users,
    utils = require('../utils.js'),
    Movies = require('../models/movies.js').Movies;

var sendNotAuth = function(req, res){
    res.send({
        result: false,
        msg: "User is not authorised"
    });
}

exports.login = function(req, res){
    var name = req.query.n;
    var pass = req.query.p;

    if (name && pass){
        Users.find(
            { login: name, password: pass },
            function(err, users){
                if (!err && users && users.length == 1) {
                    var user = users[0];
                    user.token = utils.guid();
                    user.save();

                    res.cookie('uid', user.token);
                    res.send({
                        user: {
                            name: user.name,
                            token: user.token
                        },
                        result: true,
                        msg: 'Ok'
                    });
                } else {
                    sendNotAuth(req, res);
                }
            });
    } else {
        sendNotAuth(req, res);
    }
}

exports.add = function(req, res){
    if(res.locals.auth) {
        var url = req.body.url;
        if (url && utils.isValidUrl(url)){
            var parser = require('../parser/main.js');
            parser.parse(url, function(movie){
                var ent = new Movies();
                ent.name = movie.title;
                ent.image = movie.image;
                ent.desc = movie.description;
                ent.save();

                res.send(true);
            });

        } else res.send({
            result: false,
            msg: 'Provided URL isn\'t valid.'
        });
    }
    else res.send(false);
}

