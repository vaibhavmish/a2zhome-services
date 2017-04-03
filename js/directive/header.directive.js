/**
 * Created by hanshika on 09/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .directive('appHeader',AppHeaderDirective);

    function AppHeaderDirective($rootScope) {
        return{
            restrict: 'E',
            controller: 'HeaderController',
            templateUrl: 'templates/header.view.html'
        };
    }
})();
