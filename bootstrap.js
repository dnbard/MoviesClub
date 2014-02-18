var Users = require('./models/users.js'),
    utils = require('./utils.js');

//TODO: refactor this part
function isStaticContent(url){
    var staticContentTokens = ['javascripts', 'stylesheets', 'images', 'fonts'];

    for(var i = 0; i < staticContentTokens.length; i++){
        var staticToken = staticContentTokens[i];
        if (utils.stringContains(url, staticToken)) return true;
    }
    return false;
}

var userAuth = function(req, res, next){
    var authFailure = function(){
        res.locals.auth = false;
        res.locals.user = null;
        next();
    };

    if (isStaticContent((req.url))) authFailure();
    else {
        var userToken = req.cookies.uid;
        Users.FindByToken(userToken, function(user){
            if (user.length > 0){
                res.locals.user = user[0];
                res.locals.auth = true;
                next();
            } else authFailure();
        }, function(){
            authFailure()
        });
    }
}

exports.userAuth = userAuth;