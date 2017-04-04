/**
 * Created by hanshika on 09/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('FooterController',FooterController);

    FooterController.$inject=['$rootScope','$scope','HandyServices','$location'];
    function FooterController($rootScope, $scope, HandyServices,$location) {
        var vm = this;
        vm.user = null;

        $scope.sendMessage = function () {
            $('#msg-loading').css({'display':'block'});
            if(angular.isUndefined($scope.contact) || angular.isUndefined($scope.contact.email) || angular.isUndefined($scope.contact.name)
                || angular.isUndefined($scope.contact.number) || angular.isUndefined($scope.contact.message) ){
                $('#contact-error').css({'display':'block'});
                $('#msg-loading').css({'display':'none'});
                return;
            }else{
                $('#contact-error').css({'display':'none'});
            }
            HandyServices.sendMessage($scope.contact.name, $scope.contact.email, $scope.contact.number, $scope.contact.message,$rootScope.selectedCity.city_name).then(function (response) {
                console.log(response);
                $('#msg-loading').css({'display':'none'});
                if(response.success){
                    $.alert("Thanks for Message!!We will contact you back shortly!!");
                }else{
                    $.alert("Sorry!! Message Recording Failed.")
                }
                $('#msg-loading').css({'display':'none'});
                $scope.contact = null;
            })
        };

        $scope.areasAvailable = [];

        HandyServices.getEnabledCities().then(function (response) {
            if(response.success){
                $scope.areasAvailable = response.data;
            }
        });

        $scope.goToServicesPage = function (area) {
            if(area!=null){
                $rootScope.selectedCity = area;
                $location.path("/services");
            }
        };
    }
})();
