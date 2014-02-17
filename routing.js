var routes = require('./routes'),
	api = require('./routes/api.js'),
	user = require('./routes/user');

var init = function(app){	
	app.get('/', routes.index);
	app.get('/users', user.list);
	
	app.get('/api/login', api.login);
    app.post('/api/add', api.add);
    app.get('/api/get', api.get);
    app.get('/api/getall', api.getall);
    app.post('/api/delete', api.delete);
    app.post('/api/watch', api.watch);
};

exports.init = init;