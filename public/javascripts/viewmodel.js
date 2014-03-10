function Viewmodel(model){
    var self = this;
    var serviceUrl = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');

    this.addMovie = new AddMovieController(this, serviceUrl);
    this.page = ko.observable(Global.Pages.Main);

    this.loading = new LoadingControl(this);

    this.showWatchedMovies = ko.observable(false);
    this.showOnlyWatchedMovies = ko.observable(false);

    //ROUTING
    this.gotoMainPage = function(){
        window.history.pushState({},'', '/');
    }

    this.gotoMovieDetailsPage = function(movie){
        window.history.pushState({},'', '/movie/' + movie.id);
    }

    this.gotoLoginPage = function(){
        window.history.pushState({},'', '/#login');
    }

    this.gotoAddMoviePage = function(){
        window.history.pushState({},'', '/#add');
    }

    $(document).ready(function(){
        Sammy(function(){
            this.get('movie/:id', function(){
                var id = this.params.id;

                var currentMovie = null;
                ko.utils.arrayForEach(self.movies(), function(movie) {
                    if (movie.id == id) currentMovie = movie;
                });

                if (currentMovie){
                    self.movieDetails(currentMovie);
                    self.page(Global.Pages.Details);
                } else {
                    this.redirect('');
                }
            });

            this.get('#login', function(){
                if (!self.isAuthorised())
                    self.page(Global.Pages.Login);
                else
                    self.page(Global.Pages.Main);
            });

            this.get('#add', function(){
                self.page(Global.Pages.AddMovie);
            });

            this.get('#get-own', function(){
                self.GetMoviesInfo();
            });

            this.get('#get-all', function(){
                self.GetAllMoviesInfo();
            });

            this.get('', function(){
                self.page(Global.Pages.Main);
            });
        }).run();
    });

    var bindMovies = $.proxy(function(data, model){
        this.movies(model.movies? model.movies: []);
        if (data != 'undefined' && data && data.user)
            this.user(data.user);
        this.gotoMainPage();
    }, this);

    this.user = ko.observable(model.user? model.user : {});
    this.movies = ko.observableArray(model.movies? model.movies: []);
    this.parsers = model.parsers;

    this.movieDetails = ko.observable({});

    this.moviesCount = ko.computed(function(){
        try{
            return this.movies().length;
        } catch(e){
            return 0;
        }
    }, this);

    this.moviesUnseen = ko.computed(function(){
        try{
            var movies = this.movies(),
                count = 0;
            for(var i in movies){
                var movie = movies[i];
                if (!movie.watched) count ++;
            }

            return count;
        } catch(e) {
            return 0;
        }
    }, this);

    this.moviesSeen = ko.computed(function(){
        try{
            var movies = this.movies();
            return movies.length - this.moviesUnseen();

        } catch(e) {
            return 0;
        }
    }, this);

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

    this.isOwnMovies = ko.computed(function(){
        if (!this.isAuthorised()) return false;

        var user = null;
        var result = true;
        ko.utils.arrayForEach(this.movies(), function(movie){
            if (user == null) user = movie.owner;
            else if (user != movie.owner) result = false;
        });

        return result;
    }, this);

    this.GetMoviesInfo = $.proxy(function (data){
        var loading = this.loading;
        loading.show();
        Utils.get(serviceUrl + '/api/get', {}, function(model){
            bindMovies(data, model);
            loading.hide();
        });
    }, this);

    this.GetAllMoviesInfo = $.proxy(function (data){
        var loading = this.loading;
        loading.show();
        Utils.get(serviceUrl + '/api/getall', {}, function(model){
            bindMovies(data, model);
            loading.hide();
        });
    }, this);

    this.onLoginClick = function(){
        var login = this.loginBox();
        var password = this.pswdBox();
        this.error({});

        Utils.get(serviceUrl + '/api/login', {
            n: login,
            p: password
        },
            this.GetMoviesInfo,
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
                if (this.page() != Global.Pages.Login) Utils.alert(this.error().msg);
            }, this)
        );

        this.loginBox('');
        this.pswdBox('');
    };

    this.onLoginCancel = function(){
        this.loginBox('');
        this.pswdBox('');

        this.gotoMainPage();
    };

    this.onMovieClick = $.proxy(function(movie, event){
        this.gotoMovieDetailsPage(movie);
    }, this);

    this.addNewMovieClick = function(){
        this.addMovie.show();
    };

    this.returnHomeClick = function(){
        this.gotoMainPage();
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

    this.onMegogoWatch = function(){
        openNewWindow("http://megogo.net/ru/search?q={0}");
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
            this.gotoLoginPage();
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

    this.onDeleteMovie = function(){
        var movie = this.movieDetails();
        this.loading.show();
        //loading will be hidden in GetMoviesInfo directive
        Utils.post(serviceUrl + '/api/delete', {
            movie: movie.id
        }, this.GetMoviesInfo);
    }

    this.onWatchMovie = function(){
        var movie = this.movieDetails();
        this.loading.show();
        Utils.post(serviceUrl + '/api/watch', {
            movie: movie.id
        },function(data){
            window.location = serviceUrl;
        }, function(){
            self.loading.hide();
            alert('error');
        })
    }

    var closeDropdown = function(dropdown){
        var menu = $(dropdown);
        menu.dropdown('toggle');
    }

    this.onShowOwnMovies = function(obj, event){
        closeDropdown('.control .dropdown-toggle');
        window.history.pushState({},'', '/#get-own');
    }

    this.onShowAllMovies = function(obj, event){
        closeDropdown('.control .dropdown-toggle');
        window.history.pushState({},'', '/#get-all');
    }

    this.onToggleWatchedMovies = function(){
        this.showWatchedMovies(!this.showWatchedMovies());
        this.showOnlyWatchedMovies(false);
    }

    this.onShowMoviewWithAllStatuses = function(){
        this.showWatchedMovies(true);
        this.showOnlyWatchedMovies(false);
    }

    this.onNotShowWatchedMovies = function(){
        this.showWatchedMovies(false);
        this.showOnlyWatchedMovies(false);
    }

    this.onShowOnlyWatchedMovies = function(){
        this.showOnlyWatchedMovies(true);
    }

    this.passwordOnChange = function(model,event){
        var keyCode = event.keyCode;

        if (keyCode == 13){
            //enter pressed
            this.onLoginClick();
        }

        return true;
    }

    this.title = ko.computed(function(){
        var page = this.page();

        if (page == Global.Pages.Details){
            return Utils.format('{0} - Кино клуб', this.movieDetails().name);
        } else if (page == Global.Pages.AddMovie){
            return 'Добавить новое кино';
        } else if (page == Global.Pages.Login){
            return 'Войти в кино клуб';
        }

        return 'Кино клуб';
    }, this);

    this.onScrollHeader = function(event){
        debugger;
    }
}

function AddMovieController(model, serviceUrl){
    var self = this;

    this.url = ko.observable('');
    this.errorCaption = ko.observable('');
    this.isWaiting = ko.observable(false);

    this.show = function(){
        this.url('');
        this.errorCaption('');
        this.isWaiting(false);
        model.gotoAddMoviePage();
    }

    var onGetCallback = $.proxy(function(data){
        model.movies(data.movies? data.movies: []);
        this.isWaiting(false);

        model.gotoMainPage();
    },this);

    this.btnClick = $.proxy(function(){
        this.errorCaption('');

        var url = this.url();
        if (!Utils.stringContains(url, 'http'))
            url = 'http://' + url;

        url = encodeURI(url);

        var isValid = Utils.isValidUrl(url);
        if (!isValid) {
            this.errorCaption('Введеный url не верен.');
            return;
        } else {
            this.isWaiting(true);
            Utils.post(serviceUrl + '/api/add', {
                url: url
            }, model.GetMoviesInfo,
                $.proxy(function(){
                this.errorCaption('Can\'t delete this movie. Something went wrong. Please report this issue.');
                this.isWaiting(false);
            },this));
        }
    }, this);

    this.closeError = $.proxy(function(){
        this.errorCaption('');
    }, this);

    this.errorVisible = ko.computed(function(){
        return this.errorCaption && this.errorCaption().length > 0;
    }, this);
}