var Users = require('./models/users.js').Users;

var userAuth = function(req, res, next){
	var userToken = req.cookies.uid;
	if (userToken) {
        Users.find({ token: userToken },
            {name:1, token:1, _id:0},
            function(err, user){
            if (err) {
                console.log(err);
                res.locals.auth = false;
                return;
            }
            res.locals.user = user;
            res.locals.auth = true;
            next();
        })
    }
	else {
        res.locals.auth = false;
        next();
    }
}

exports.userAuth = userAuth;