var fs = fs = require('fs');

exports.run = function(app, callback){
    var path = './commands';
    if (!fs.existsSync(path)) return;
    var commandFiles = fs.readdirSync(path);

    for(var i = 0; i < commandFiles.length; i ++){
        var command = require('./commands/' + commandFiles[i]);
        command.run();        
    }

    callback();
}