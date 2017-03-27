/**
 * Created by hanshika on 09/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeMakeOverController',HomeMakeOverController);

    HomeMakeOverController.$inject=['$rootScope','$scope','HandyServices','ModalService'];
    function HomeMakeOverController($rootScope, $scope, HandyServices,ModalService) {
        var vm = this;
        vm.user = null;

        $scope.createHMP = function () {
            $('#hmp-loading').css({'display':'block'});
            if(angular.isUndefined($scope.hmp) || angular.isUndefined($scope.hmp.name) || angular.isUndefined($scope.hmp.number)
                || angular.isUndefined($scope.hmp.email)
                || angular.isUndefined($scope.hmp.area) || angular.isUndefined($scope.hmp.message) ){
                $('#hmp-error').css({'display':'block'});
                $('#hmp-loading').css({'display':'none'});
                return;
            }else{
                $('#hmp-error').css({'display':'none'});
            }
            if(angular.isUndefined($rootScope.selectedCity) && !$rootScope.locationModalOpened){
                $('#hmp-loading').css({'display':'none'});
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
            var location = $rootScope.selectedCity.city_name + $scope.hmp.area;
            HandyServices.createHMP($scope.hmp.name, $scope.hmp.email, $scope.hmp.number,
                $scope.hmp.message,location).then(function (response) {
                if(response.success){
                    $('#resultTab').show();
                    $('#tab1').hide();
                }else{
                    $.alert(response.message);
                }
                $('#hmp-loading').css({'display':'none'});
            })
        };

    }
})();
