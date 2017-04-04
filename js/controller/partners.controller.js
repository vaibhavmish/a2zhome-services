/**
 * Created by hanshika on 09/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('PartnersController',PartnersController);

    PartnersController.$inject=['$rootScope','$scope','HandyServices','ModalService'];
    function PartnersController($rootScope, $scope, HandyServices,ModalService) {
        var vm = this;
        vm.user = null;

        $scope.createPartners = function () {
            $('#partners-loading').css({'display':'block'});
            if(angular.isUndefined($scope.partners) || angular.isUndefined($scope.partners.name) || angular.isUndefined($scope.partners.number)
                || angular.isUndefined($scope.partners.email)
                || angular.isUndefined($scope.partners.area) || angular.isUndefined($scope.partners.message) ){
                $('#partners-error').css({'display':'block'});
                $('#partners-loading').css({'display':'none'});
                return;
            }else{
                $('#partners-error').css({'display':'none'});
            }
            if(angular.isUndefined($rootScope.selectedCity) && !$rootScope.locationModalOpened){
                $('#partners-loading').css({'display':'none'});
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
            var location = $rootScope.selectedCity.city_name + $scope.partners.area;
            HandyServices.createPartners($scope.partners.name, $scope.partners.email, $scope.partners.number,
                $scope.partners.message,location).then(function (response) {
                if(response.success){
                    $('#resultTab').show();
                    $('#tab1').hide();
                }else{
                    $.alert(response.message);
                }
                $('#partners-loading').css({'display':'none'});
            })
        };

    }
})();
