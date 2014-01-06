function Viewmodel(model){
    var serviceUrl = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');

    this.addMovie = new AddMovieController(this, serviceUrl);

    this.page = ko.observable(Global.Pages.Main);
    this.user = ko.observable(model.user[0]? model.user[0] : {});
    this.movies = ko.observableArray(model.movies? model.movies: []);
    this.parsers = model.parsers;

    this.isAuthorised = ko.computed(function(){
        var user = this.user();
        return !Utils.isEmpty(user);
    }, this);

    this.loginBox = ko.observable('');
    this.pswdBox = ko.observable('');

    this.onLogoutClick = function(){
        this.user({});
        Utils.eraseCookie('uid');
    };

    this.onLoginClick = function(){
        var login = this.loginBox();
        var password = this.pswdBox();

        Utils.get(serviceUrl + '/api/login', {
            n: login,
            p: password
        },
            $.proxy(function (data){
                this.user(data.user);
            }, this)
        );

        this.loginBox('');
        this.pswdBox('');
    };

    this.addNewMovieClick = function(){
        this.addMovie.show();
    };

    this.returnHomeClick = function(){
        this.page(Global.Pages.Main);
    };
}

function AddMovieController(model, serviceUrl){
    this.url = ko.observable('');
    this.errorCaption = ko.observable('');

    this.show = function(){
        this.url('');
        this.errorCaption('');
        model.page(Global.Pages.AddMovie);
    }

    this.btnClick = $.proxy(function(){
        this.errorCaption('');

        var url = this.url();
        if (!Utils.stringContains(url, 'http'))
            url = 'http://' + url;
        var isValid = Utils.isValidUrl(url);
        if (!isValid) {
            this.errorCaption('Введеный url не верен.');
            return;
        } else {
            Utils.post(serviceUrl + '/api/add', {
                url: url
            }, function(data){
                Utils.get(serviceUrl + '/api/get', {}, function(data){
                    model.movies(data.movies? data.movies: []);
                    model.page(Global.Pages.Main);
                });
            })
        }
    }, this);

    this.closeError = $.proxy(function(){
        this.errorCaption('');
    }, this);

    this.errorVisible = ko.computed(function(){
        return this.errorCaption && this.errorCaption().length > 0;
    }, this);
}
