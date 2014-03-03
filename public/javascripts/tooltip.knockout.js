ko.bindingHandlers.tooltip = {
    init: function (element, valueAccessor) {
        var value = valueAccessor(),
            el = $(element);

        el.tooltip({
           title: typeof(value) == 'function'? value() : value
        });
    }
}
