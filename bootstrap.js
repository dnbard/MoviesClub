var Users = require('./models/users.js');

var userAuth = function(req, res, next){
	var userToken = req.cookies.uid;
	Users.FindByToken(userToken, function(user){
        res.locals.user = user;
        res.locals.auth = true;
        next();
    }, function(){
        res.locals.auth = false;
        next();
    });
}

exports.userAuth = userAuth;