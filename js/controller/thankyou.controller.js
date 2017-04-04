/**
 * Created by hanshika on 10/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('ThankYouController',ThankYouController);

    ThankYouController.$inject=['$rootScope','$scope','$location','$route','close'];
    function ThankYouController($rootScope, $scope, $location, $route,close) {
        var vm = this;
        vm.user = null;

        $scope.closeModal = function(result) {
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };
        $scope.gotoMaintenance = function () {
            $location.path('/maintenance');
        }
    }
})();
