/**
 * Created by hanshika on 09/03/2017
 */
(function(){
    'use strict';

    angular
        .module('app' , ['ngRoute','google-signin'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider','$locationProvider','$httpProvider','GoogleSigninProvider'];
    function config($routeProvider, $locationProvider,$httpProvider,GoogleSigninProvider) {
        GoogleSigninProvider.init({
            client_id: "336458288373-422f41kjqopb7gernjbgs9hiekgoeic8.apps.googleusercontent.com"
        });
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
            .when('/partners',{
                controller: 'PartnersController',
                templateUrl: 'templates/partners.view.html',
                controllerAs: 'vm'
            })
            .when('/home-makeover',{
                controller: 'HomeMakeOverController',
                templateUrl: 'templates/home-makeover.view.html',
                controllerAs: 'vm'
            })
            .when('/profile',{
                controller: 'ProfileController',
                templateUrl: 'templates/profile.view.html',
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