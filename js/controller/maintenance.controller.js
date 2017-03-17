/**
 * Created by hanshika on 09/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('MaintenanceController',MaintenanceController);

    MaintenanceController.$inject=['$rootScope','$scope','$location','$route'];
    function MaintenanceController($rootScope, $scope, $location, $route) {
        var vm = this;
        vm.user = null;
    }
})();
