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

        $rootScope.loginModalOpened = false;
        $rootScope.locationModalOpened = false;

        $scope.openLoginModal = function () {
            if(angular.isUndefined($rootScope.user) && !$rootScope.loginModalOpened) {
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
            if(angular.isUndefined($rootScope.selectedCity) && !$rootScope.locationModalOpened) {
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

        $scope.Logout = function () {
            $scope.user = null;
            $rootScope.loginModalOpened = false;
            $rootScope.user = undefined;
        }

        $scope.ChangeLocation = function () {
            $scope.selectedCity = null;
            $rootScope.locationModalOpened = false;
            $rootScope.selectedCity = undefined;
            $scope.openLocationModal();
        }

    }
})();