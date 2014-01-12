ko.bindingHandlers.loadingVisible = {
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        var valueUnwrapped = ko.unwrap(value);
        var element = $(element);

        if (valueUnwrapped == true)
            element.css('display', 'block')
                .animate({'opacity':'1'},250);
        else{
            element.animate({'opacity':'0'},450);
            setTimeout(function(){
                element.css('display', 'none');
            }, 450);
        }
    }
};

function LoadingControl(parent){
    this.isActive = ko.observable(false);

    this.show = function(){
        this.isActive(true);
    }

    this.hide = function(){
        this.isActive(false);
    }
}
