var routes = require('./routes'),
	api = require('./routes/api.js'),
	user = require('./routes/user'),
    test = require('./routes/test.js');

var init = function(app){
    app.get('/', routes.index);
    app.get('/movie/:movieid', routes.index);
	app.get('/users', user.list);
	
	app.get('/api/login', api.login);
    app.post('/api/add', api.add);
    app.get('/api/get', api.get);
    app.get('/api/getall', api.getall);
    app.post('/api/delete', api.delete);
    app.post('/api/watch', api.watch);

    app.get('/api/articles', api.getArticles);

    app.get('/test/article', test.index);
};

exports.init = init;