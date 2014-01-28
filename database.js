var mongoose = require('mongoose'), 
    config = require('./config.js'),
    fs = require('fs'),
    migrations = require('./models/migrations.js');

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

function migration(){
    var migrationFiles = fs.readdirSync('./migrations');

    if (migrationFiles.length > 0){
        migrations.getAll(function(err, migrationList){
            for(var i = 0; i < migrationFiles.length; i ++){
                var isApplied = false;

                for(var j = 0; j < migrationList.length; j ++){
                    if (migrationList[i].name == migrationFiles[i]){
                        isApplied = true;
                        break;
                    }
                }

                if (!isApplied){
                    var migration = require('./migrations/' + migrationFiles[i]);
                    migration.apply();

                    migrations.save(migrationFiles[i]);
                }
            }
        });
    }
}

exports.connect = connect;
exports.migration = migration;