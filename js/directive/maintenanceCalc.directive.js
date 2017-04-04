/**
 * Created by hanshika on 10/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .directive('maintenanceCalculator',MaintenanceCalculatorDirective);

    function MaintenanceCalculatorDirective($rootScope) {
        return{
            restrict: 'E',
            controller: 'MaintenanceCalculatorController',
            templateUrl: 'templates/maintenanceCalc.widget.html'
        };
    }
})();
