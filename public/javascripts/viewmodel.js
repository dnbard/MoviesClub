function Viewmodel(model){

    this.page = ko.observable(Global.Pages.Main);


    this.movies = ko.observableArray([]);
    this.movies.push({});
    this.movies.push({});
    this.movies.push({});
    this.movies.push({});
    this.movies.push({});
}
