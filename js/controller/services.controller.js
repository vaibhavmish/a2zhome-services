/**
 * Created by hanshika on 10/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('ServicesController',ServicesController);

    ServicesController.$inject=['$rootScope','$scope','$location','HandyServices','ModalService'];
    function ServicesController($rootScope, $scope, $location, HandyServices,ModalService) {
        var vm = this;
        vm.user = null;

        $scope.services = [];

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

        $scope.$watch(function () {
            return $rootScope.selectedCity;
        }, function(){
            if(!angular.isUndefined($rootScope.selectedCity)) {
                HandyServices.getServiceListCitywise($rootScope.selectedCity.city_name).then(function (response) {
                    if (response.success) {
                        $scope.services = response.data;
                    }else{
                        $scope.services = null;
                    }
                });
            }
        }, true);

        $scope.selectService = function (service) {
            $scope.selectedService = service;
        }

        $scope.$watch(function () {
            return $scope.selectedService;
        }, function(){
            if(!angular.isUndefined($scope.selectedService)) {
                HandyServices.getReviewsListServiceIDwise($scope.selectedService._id).then(function (response) {
                    if (response.success) {
                        $scope.reviewsList = response.data;
                    }else{
                        $scope.reviewsList = null;
                    }
                })
            }
        }, true);

        $scope.bookNow = function (service_id) {
            $rootScope.selectedService = $scope.selectedService;
            ModalService.showModal({
                templateUrl: "templates/bookService.modal.html",
                controller: "BookServiceController"
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    $scope.yesNoResult = result ? "You said Yes" : "You said No";
                });
            });
        };

        $scope.$watch(function () {
            return $scope.searchText;
        }, function(){
            if(!angular.isUndefined($rootScope.selectedCity) && !angular.isUndefined($scope.searchText)) {
                HandyServices.searchServices($rootScope.selectedCity.city_name, $scope.searchText, "enabled").then(function (response) {
                    if (response.success) {
                        console.log(response.data);
                        $scope.services = response.data;
                    }else{
                        $scope.services = null;
                    }
                });
            }
        }, true);

    }
})();
