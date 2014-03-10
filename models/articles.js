var mongoose = require('mongoose'),
    utils = require('../utils.js');

var Classes = {
    default: 'plainText',
    link: 'link',
    user_male: 'userMale',
    user_female: 'userFemale',
    movie: 'movie',
    movie_watched: 'movieWatched'
}

var articlesSchema = mongoose.Schema({
    content:[{
        class: String,
        text: String,
        order: Number,
        objectId: String
    }],
    timestamp: Date,
    class: {type: String, index : true },
    objectId: {type: String, index: true }
});

var Articles = mongoose.model('Articles', articlesSchema);

exports.add = add;

function add(obj){
    var article = new Articles();
    article.timestamp = new Date();
    article.class = Classes.default;

    if (!article.add) article.add = addNewLine;
    article.add(obj);
    return article;

    function addNewLine(obj){
        this.content.push({
            text: obj.text,
            order: article.content.length,
            objectId: obj.objectId ? obj.objectId : null,
            class: obj.class ? obj.class : Classes.default
        });
    }
}

exports.addMovieWatchedMessage = function(user, movie){
    var article = add(
        {
            text: user.name,
            class: user.gender == 'M' ? Classes.user_male : Classes.user_female,
            objectId: user.id
        });

    article.class = Classes.movie_watched;
    article.objectId = movie.id;

    if (user.gender == 'M') {
        article.add({text: 'посмотрел'});
    } else {
        article.add({text: 'посмотрела'});
    }

    article.add({
        text: movie.name,
        class: Classes.movie,
        objectId: movie.id
    });

    article.save();
}

exports.removeMovieWatchedMessage = function(user, movieId, callback){
    Articles.findOneAndRemove({class: Classes.movie_watched, objectId: movieId},
        {},
        callback);
}
