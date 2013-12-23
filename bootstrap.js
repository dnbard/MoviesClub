var Users = require('./models/users.js').Users;

function userAuth(req, res, next){
	var userToken = req.cookies.uid;
	if (userToken) Users.find({ token: userToken }, userAuthCallback);	
	else res.locals.auth = false;

	next();
}

function userAuthCallback(err, user){
	if (err) {
		console.log(err);
		return;
	}			
	res.locals.user = user;
	res.locals.auth = true;
}