function Viewmodel(model){
    var serviceUrl = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');

    this.addMovie = new AddMovieController(this, serviceUrl);

    this.page = ko.observable(Global.Pages.Main);
    this.user = ko.observable(model.user? model.user : {});
    this.movies = ko.observableArray(model.movies? model.movies: []);
    this.parsers = model.parsers;

    this.movieDetails = ko.observable({});

    this.isAuthorised = ko.computed(function(){
        var user = this.user();
        return !Utils.isEmpty(user);
    }, this);

    this.loginBox = ko.observable('');
    this.pswdBox = ko.observable('');

    this.onLogoutClick = function(){
        this.user({});
        Utils.eraseCookie('uid');
        window.location.reload(true);
    };

    this.error = ko.observable({});

    this.onLoginClick = function(){
        var login = this.loginBox();
        var password = this.pswdBox();
        this.error({});

        Utils.get(serviceUrl + '/api/login', {
            n: login,
            p: password
        },
            $.proxy(function (data){
                Utils.get(serviceUrl + '/api/get', {},
                $.proxy(function(model){
                    this.movies(model.movies? model.movies: []);
                    this.page(Global.Pages.Main);
                    this.user(data.user);
                }, this));
            }, this),
            $.proxy(function(data){
                if (data && data.msg == "User is not authorised")
                    this.error({
                        type: 'login',
                        msg: 'Пользователь не найден или пароль не верен. Проверьте правильность вводимых данных.'
                    });
                else
                    this.error({
                        type: 'login',
                        msg: 'Не удалось войти в систему'
                    });
                debugger;
            }, this)
        );

        this.loginBox('');
        this.pswdBox('');
    };

    this.onLoginCancel = function(){
        this.loginBox('');
        this.pswdBox('');

        this.page(Global.Pages.Main);
    };

    this.onMovieClick = $.proxy(function(obj, event){
        this.movieDetails(obj);
        this.page(Global.Pages.Details);
    }, this);

    this.addNewMovieClick = function(){
        this.addMovie.show();
    };

    this.returnHomeClick = function(){
        this.page(Global.Pages.Main);
    };

    var openNewWindow = $.proxy(function(pathPattern){
        var movie = this.movieDetails();
        var name = movie.name;
        if (name){
            var path = Utils.format(pathPattern, name);
            window.open(path, '_blank');
        }
    }, this);

    this.onExuaWatch = function(){
        openNewWindow("http://ex.ua/search?s={0}");
    };

    this.onVkWatch = function(){
        openNewWindow("http://vk.com/video?q={0}&section=search");
    };

    this.onKinopoiskSearch = function(){
        openNewWindow("http://www.kinopoisk.ru/index.php?first=no&what=&kp_query={0}");
    };

    this.onRutrackerSearch = function(){
        openNewWindow("http://rutracker.org/forum/tracker.php?nm={0}");
    };

    this.showLoginPage = function(){
        this.error({});
        this.loginBox('');
        this.pswdBox('');

        if (!this.isAuthorised()){
            this.page(Global.Pages.Login);
        }
    };

    this.formatGenres = function(){
        var movie = this.movieDetails();
        if (movie.genres){
            if (movie.genres.length == 1)
                return movie.genres[0];
            else if (movie.genres.length > 1) return movie.genres.join(', ');
        }
        return '';
    }
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
