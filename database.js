var mongoose = require('mongoose'), 
    config = require('./config.js');

var cString = config.databaseConnectionString;

function connect(callback){
    var reconnTimer = null;

    var mongourl = cString;
    mongoose.connect(mongourl);
    var db = mongoose.connection;
    db.on('error', function(){
        console.log("Can't connect to " + mongourl);
    });
    db.on('close', function() {
        console.log("Connection to " + mongourl + " is closed");
        console.log("Trying reconnect to " + mongourl);
        if (reconnTimer) { }
        else {
            reconnTimer = setTimeout(tryReconnect, 500); // try after delay
        }
    });
    db.on('open', function() {
        console.log('Connected to ' + mongourl);
        if (reconnTimer) { clearTimeout(reconnTimer); reconnTimer = null; }
        return callback();
    });

    function tryReconnect() {
        reconnTimer = null;
        db = mongoose.connect(mongourl);
    };
}

exports.connect = connect;
