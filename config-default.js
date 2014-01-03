//before create application
//you need to create file 'config.js' from this template

var databaseConnectionString = 'mongodb://<user>:<password>@<host>:<port>/<dbname>';\

var parsers = {
    'kinobaza.tv': 'kinobaza'
}

exports.databaseConnectionString = databaseConnectionString;
exports.parsers = parsers;