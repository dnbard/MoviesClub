var s4 = function() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};

Utils = {
    createCookie: function (name, value, days) {
        var expires;

        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
    },

    readCookie: function (name) {
        var nameEQ = escape(name) + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return unescape(c.substring(nameEQ.length, c.length));
        }
        return null;
    },

    eraseCookie: function (name) {
        this.createCookie(name, "", -1);
    },

    isEmpty: function(obj) {
        if (obj == null) return true;
        if (obj.length && obj.length > 0)    return false;
        if (obj.length === 0)  return true;
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }
        return true;
    },

    format: function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        var sprintfRegex = /\{(\d+)\}/g;

        var sprintf = function (match, number) {
            return number in args ? args[number] : match;
        };

        return format.replace(sprintfRegex, sprintf);
    },

    get: function(url, sendData, callback, failureCallback){
        $.get(url, sendData, function(data){
            if (data && data.result){
                if (callback)
                    callback(data);
            } else {
                if (!data){
                    console.log(Utils.format('Error. Can\'t GET {0}', url));
                    if (failureCallback)
                        failureCallback();
                } else {
                    console.log(Utils.format('Error. Can\'t GET {0}, {1}', url, data.msg));
                    if (failureCallback)
                        failureCallback(data);
                }
            }
        })
    },

    guid: function(){
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }
}