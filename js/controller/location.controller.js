/**
 * Created by hanshika on 10/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('LocationController',LocationController);

    LocationController.$inject=['$rootScope','$scope','HandyServices','close'];
    function LocationController($rootScope, $scope,HandyServices,close) {
        var vm = this;
        vm.user = null;

        $scope.closeModal = function(result) {
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };

        $scope.cities = [
            // {
            //     name:'Pune',
            //     id:1
            // },{
            //     name:'Ahmedabad',
            //     id:2
            // },{
            //     name:'Gujarat',
            //     id:3
            // }
            ];

        if(angular.isUndefined($scope.selectedCity)){
            if(!angular.isUndefined($rootScope.selectedCity)){
                $scope.selectedCity = $rootScope.selectedCity;
            }
        }

        HandyServices.getEnabledCities().then(function (response) {
            if(response.success){
                $scope.cities = response.data;
                $scope.cities.sort(function(a,b) {
                    return ((a.city_name < b.city_name) ? -1 : ((a.city_name > b.city_name) ? 1 : 0));
                })
                $scope.selectedCity = $scope.cities[0];
            }
        })

        $scope.selectedCity = {};

        $scope.citySelected = function () {
            $('#location').css({'visibility':'visible'});
            $rootScope.locationModalOpened = true;
            $rootScope.selectedCity = $scope.selectedCity;
        }

    }
})();
