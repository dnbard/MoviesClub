var express = require('express'),
	http = require('http'),
	path = require('path'),
	db = require('./database.js'),
	bootstrap = require('./bootstrap.js'),
	routing = require('./routing.js'),
    commands = require('./commands.js');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());

app.use(bootstrap.userAuth);

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routing.init(app);

var port = app.get('port');
http.createServer(app).listen(port, function(){
  console.log('Express server listening on port ' + port);
});

db.connect(function(){
    commands.run(function(app){
        db.migration();
    });
});