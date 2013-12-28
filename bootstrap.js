var Users = require('./models/users.js').Users;

var userAuth = function(req, res, next){
	var userToken = req.cookies.uid;
	if (userToken) {
        Users.find({ token: userToken }, function(err, user){
            if (err) {
                console.log(err);
                res.locals.auth = false;
                return;
            }
            res.locals.user = user;
            res.locals.auth = true;
        })
    }
	else {
        res.locals.auth = false;
    }

	next();
}

exports.userAuth = userAuth;