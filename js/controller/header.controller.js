/**
 * Created by hanshika on 09/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('HeaderController',HeaderController);

    HeaderController.$inject=['$rootScope','$scope','$location','ModalService'];
    function HeaderController($rootScope, $scope, $location, ModalService) {
        var vm = this;
        vm.user = null;

        $scope.gotoHome = function () {
            $location.path("/home");
        };

        $scope.openLoginModal = function () {
            if(angular.isUndefined($rootScope.user)) {
                ModalService.showModal({
                    templateUrl: "templates/login.modal.html",
                    controller: "LoginController"
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                        $scope.yesNoResult = result ? "You said Yes" : "You said No";
                    });
                });
            }
        };

        $scope.openLocationModal = function () {
            if(angular.isUndefined($rootScope.selectedCity)) {
                ModalService.showModal({
                    templateUrl: "templates/location.modal.html",
                    controller: "LocationController"
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                        $scope.yesNoResult = result ? "You said Yes" : "You said No";
                    });
                });
            }
        };

        $scope.$watch(function () {
            return $rootScope.user;
        }, function(){
            if(!angular.isUndefined($rootScope.user)){
                $scope.user = $rootScope.user;
            }
        }, true);

        $scope.$watch(function () {
            return $rootScope.selectedCity;
        }, function(){
            if(!angular.isUndefined($rootScope.selectedCity)){
                $scope.selectedCity = $rootScope.selectedCity;
            }
        }, true);

    }
})();