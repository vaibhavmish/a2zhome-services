/**
 * Created by hanshika on 09/03/2017
 */
(function(){
    'use strict';

    angular
        .module('app' , ['ngRoute'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider','$locationProvider','$httpProvider'];
    function config($routeProvider, $locationProvider,$httpProvider) {
        $routeProvider
            .when('/home',{
                controller: 'HomeController',
                templateUrl: 'templates/home.view.html',
                controllerAs: 'vm'
            })
            .when('/maintenance',{
                controller: 'MaintenanceController',
                templateUrl: 'templates/maintenance.view.html',
                controllerAs: 'vm'
            })
            .when('/feedback',{
                controller: 'FeedbackController',
                templateUrl: 'templates/feedback.view.html',
                controllerAs: 'vm'
            })
            .when('/services',{
                controller: 'ServicesController',
                templateUrl: 'templates/services.view.html',
                controllerAs: 'vm'
            })
            .when('/corporates',{
                controller: 'CorporatesController',
                templateUrl: 'templates/corporates.view.html',
                controllerAs: 'vm'
            })
            .otherwise({ redirectTo: '/home'});
    }
    run.$inject = ['$rootScope','$location','$http'];
    function run($rootScope, $location, $http) {
        $rootScope.baseurl  = "https://handy-service-server.herokuapp.com";
        $rootScope.temps = {};
    }
})();