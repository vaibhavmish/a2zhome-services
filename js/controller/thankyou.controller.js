/**
 * Created by hanshika on 10/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('ThankYouController',ThankYouController);

    ThankYouController.$inject=['$rootScope','$scope','$location','$route'];
    function ThankYouController($rootScope, $scope, $location, $route) {
        var vm = this;
        vm.user = null;

        $scope.gotoMaintenance = function () {
            $location.path('/maintenance');
        }
    }
})();
