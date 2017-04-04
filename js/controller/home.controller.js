/**
 * Created by hanshika on 09/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController',HomeController);

    angular.module('app').filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace !== -1) {
                    //Also remove . and , so its gives a cleaner result.
                    if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
                        lastspace = lastspace - 1;
                    }
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });

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
                        if($scope.serviceList.length > 10){
                            $scope.serviceList = $scope.serviceList.slice(0,10);
                        }
                    } else {
                        $.alert(response.message);
                    }
                });
            }
        }, true);

        $scope.processRequestCallback = function(){
            $('#loading').css({'display':'block'});
            if(angular.isUndefined($rootScope.selectedCity) && !$rootScope.locationModalOpened){
                $('#loading').css({'display':'none'});
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

            if(angular.isUndefined($rootScope.user) && !$rootScope.loginModalOpened){
                $('#loading').css({'display':'none'});
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
                $('#loading').css({'display':'none'});
                $('#rc-error').css({'display':'block'});
            }

            HandyServices.requestCallback($scope.rc.name,$scope.rc.email,$scope.rc.mobile,$rootScope.selectedCity,$rootScope.user._id).then(function (response) {
                $('#rc-error').css({'display':'none'});
                if(response.success){
                    $scope.rc = null;
                    $('#loading').css({'display':'none'});
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

        };

        $scope.getRange = function(num) {
            var len = parseInt(num);
            var a = new Array(len);
            for(var i=0;i<len;i++){
                a[i]=i;
            }
            return a;
        };

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
        };

        $scope.sendAppLink = function () {
            if(angular.isUndefined($scope.numberForApp)){
                $('#number-error').show();
                return;
            }else{
                $('#number-error').hide();
                HandyServices.sendAppLink($scope.numberForApp).then(function (response) {
                    if(response.success){
                        $.alert("You will recieve download link via SMS shortly!!");
                    }else{
                        $.alert(response.message);
                    }
                })
            }
        }

        $scope.ourCustomers = [];
        HandyServices.getOurCustomers().then(function (res) {
            if(res.success){
                $scope.ourCustomers = res.data;
            }
        });

        $scope.mediaCoverages = [];
        HandyServices.getTestimonials().then(function (res) {
            if(res.success){
                $scope.mediaCoverages = res.data;
            }
        });

        $scope.ourClients = [];
        HandyServices.getOurClients().then(function (res) {
            if(res.success){
                $scope.ourClients = res.data;
            }
        });

        $scope.setSelectedService = function (service) {
            $rootScope.selectedService = service;
        }
    }
})();
