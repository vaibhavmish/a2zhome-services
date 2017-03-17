/**
 * Created by hanshika on 10/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('LocationController',LocationController);

    LocationController.$inject=['$rootScope','$scope','HandyServices'];
    function LocationController($rootScope, $scope,HandyServices) {
        var vm = this;
        vm.user = null;

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
                console.log(response.data);
                $scope.cities = response.data;
            }
        })

        $scope.selectedCity = {};

        $scope.citySelected = function () {
            $rootScope.locationModalOpened = true;
            $rootScope.selectedCity = $scope.selectedCity;
        }

    }
})();
