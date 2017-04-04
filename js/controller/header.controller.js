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
                        $('body').removeClass('modal-open');
                        $('.modal-backdrop').remove();
                    });
                });
            }else{
                $location.path('/profile');
            }
        };

        $scope.openLocationModal = function () {
            if(angular.isUndefined($rootScope.selectedCity) && !$rootScope.locationModalOpened) {
                $('#location').css({'visibility':'hidden'});
                var modal = ModalService.showModal({
                    templateUrl: "templates/location.modal.html",
                    controller: "LocationController"
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                        $('#location').css({'visibility':'visible'});
                    });
                });
            }
        };

        $scope.openLocationModal();

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
            }else if($rootScope.locationModalOpened){
                $('#location').css({'visibility':'visible'});
            }
        }, true);

        $scope.Logout = function () {
            if($rootScope.user && $rootScope.user.fblogin){
                FB.logout(function(response) {
                    $scope.user = null;
                    $rootScope.loginModalOpened = false;
                    $rootScope.user = undefined;
                });
            }else if($rootScope.user && $rootScope.user.googleLogin) {
                var auth2 = gapi.auth2.getAuthInstance();
                auth2.signOut().then(function () {
                    $scope.user = null;
                    $rootScope.loginModalOpened = false;
                    $rootScope.user = undefined;
                });
            }else{
                    $scope.user = null;
                    $rootScope.loginModalOpened = false;
                    $rootScope.user = undefined;
            }
        };

        $scope.ChangeLocation = function () {
            $scope.selectedCity = null;
            $rootScope.locationModalOpened = false;
            $rootScope.selectedCity = undefined;
            $scope.openLocationModal();
        }

        $scope.goToFeedback = function () {
            $location.path('/feedback');
        }

        $scope.goToHomeMakeover = function () {
            $location.path('/home-makeover');
        }

        $scope.goToMaintenance = function () {
            $location.path('/maintenance');
        }

        $scope.goToCorporate = function () {
            $location.path('/corporates');
        }

    }
})();