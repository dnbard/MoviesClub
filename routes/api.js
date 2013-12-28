var Users = require('../models/users.js').Users,
    utils = require('../utils.js');

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
        Users.find({ login: name, password: pass }, function(err, users){
            if (!err && users && users.length == 1) {
                var user = users[0];
                user.token = utils.guid();
                user.save();

                res.cookie('uid', user.token);
                res.send({
                    username: user.login,
                    token: user.token,
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

