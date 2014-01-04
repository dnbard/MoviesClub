//before create application
//you need to create file 'config.js' from this template

var databaseConnectionString = 'mongodb://<user>:<password>@<host>:<port>/<dbname>';

var parsers = [
    {
        site:'kinobaza.tv',
        parser: 'kinobaza'
    },
    {
        site:'kinopoisk.ru',
        parser: 'kinobaza'
    }
]

exports.databaseConnectionString = databaseConnectionString;
exports.parsers = parsers;