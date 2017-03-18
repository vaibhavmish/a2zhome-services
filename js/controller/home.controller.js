/**
 * Created by hanshika on 09/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController',HomeController);

    HomeController.$inject=['$rootScope','$scope','ModalService','HandyServices'];
    function HomeController($rootScope, $scope, ModalService, HandyServices) {
        var vm = this;
        vm.user = null;

        $scope.serviceList = [];

        $scope.$watch(function () {
            return $rootScope.selectedCity;
        }, function(){
            if(!angular.isUndefined($rootScope.selectedCity)) {
                HandyServices.getServiceListCitywise($rootScope.selectedCity.city_name).then(function (response) {
                    if (response.success) {
                        $scope.serviceList = response.data;
                    } else {
                        $.alert(response.message);
                    }
                });
            }
        }, true);

        $scope.processRequestCallback = function(){
            if(angular.isUndefined($rootScope.selectedCity)){
                ModalService.showModal({
                    templateUrl: "templates/location.modal.html",
                    controller: "LocationController"
                }).then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        $scope.yesNoResult = result ? "You said Yes" : "You said No";
                    });
                });
            }

            if(angular.isUndefined($rootScope.user)){
                ModalService.showModal({
                    templateUrl: "templates/login.modal.html",
                    controller: "LoginController"
                }).then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        $scope.yesNoResult = result ? "You said Yes" : "You said No";
                    });
                });
            }

            if(angular.isUndefined($scope.rc) || angular.isUndefined($scope.rc.name) || angular.isUndefined($scope.rc.email) || angular.isUndefined($scope.rc.mobile)){
                $('#rc-error').css({'display':'block'});
            }

            HandyServices.requestCallback($scope.rc.name,$scope.rc.email,$scope.rc.mobile,$rootScope.selectedCity,$rootScope.user.user_id).then(function (response) {
                $('#rc-error').css({'display':'none'});
                if(response.success){
                    $scope.rc = null;
                    ModalService.showModal({
                        templateUrl: "templates/thankyou.modal.html",
                        controller: "ThankYouController"
                    }).then(function(modal) {
                        modal.element.modal();
                        modal.close.then(function(result) {
                            $scope.yesNoResult = result ? "You said Yes" : "You said No";
                        });
                    });
                }else{
                    $.alert(response.message);
                }
            })

        }

        $scope.bookNow = function (service) {
            $rootScope.selectedService = service;
            ModalService.showModal({
                templateUrl: "templates/bookService.modal.html",
                controller: "BookServiceController"
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    $scope.yesNoResult = result ? "You said Yes" : "You said No";
                });
            });
        }
    }
})();
