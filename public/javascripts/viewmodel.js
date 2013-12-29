function Viewmodel(model){

    var serviceUrl = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
    this.page = ko.observable(Global.Pages.Main);
    this.user = ko.observable(model.user[0]? model.user[0] : {});
    this.movies = ko.observableArray(model.movies? model.movies: []);

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
}
