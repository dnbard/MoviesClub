function toTimeAgo (dt) {
    var secs = (((new Date()).getTime() - dt.getTime()) / 1000),
        days = Math.floor(secs / 86400);

    return days === 0 && (
        secs < 60 && "Только что" ||
            secs < 120 && "Минуту назад" ||
            secs < 3600 && Math.floor(secs / 60) + " минут назад" ||
            secs < 7200 && "час назад" ||
            secs < 86400 && Math.floor(secs / 3600) + " часов назад") ||
        days === 1 && "вчера" ||
        days < 31 && days + " дней назад" ||
        days < 60 && "один месяц назад" ||
        days < 365 && Math.ceil(days / 30) + " месяцев назад" ||
        days < 730 && "год назад" ||
        Math.ceil(days / 365) + " лет назад";
};

ko.bindingHandlers.timeAgo = {
    update: function (element, valueAccessor) {
        var val = valueAccessor(),
            date = new Date(val), // WARNING: this is not compatibile with IE8
            timeAgo = toTimeAgo(date);
        return ko.bindingHandlers.html.update(element, function () {
            return '<time datetime="' + encodeURIComponent(val) + '">' + timeAgo + '</time>';
        });
    }
};
