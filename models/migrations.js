var mongoose = require('mongoose'),
    utils = require('../utils.js');

var migrationsSchema = mongoose.Schema({
    name: String,
    done: { type: Date, default: Date.now }
});

var Migrations = mongoose.model('Migrations', migrationsSchema);

var getAll = function(callback){
    Migrations.find({}, function(err, migrations){
        if (err) callback(err);

        callback(null, migrations);
    });
}

var save = function(migrationName){
    var entity = new Migrations();
    entity.name = migrationName;
    entity.save();
}

exports.Migrations = Migrations;
exports.getAll = getAll;
exports.save = save;