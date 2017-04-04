/**
 * Created by hanshika on 09/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('CorporatesController',CorporatesController);

    CorporatesController.$inject=['$rootScope','$scope','HandyServices','ModalService'];
    function CorporatesController($rootScope, $scope, HandyServices,ModalService) {
        var vm = this;
        vm.user = null;

        $scope.createCorporate = function () {
            $('#corp-loading').css({'display':'block'});
            if(angular.isUndefined($scope.corporates) || angular.isUndefined($scope.corporates.name) || angular.isUndefined($scope.corporates.number)
                || angular.isUndefined($scope.corporates.email) || angular.isUndefined($scope.corporates.organization)
                || angular.isUndefined($scope.corporates.area) || angular.isUndefined($scope.corporates.message) ){
                $('#corporates-error').css({'display':'block'});
                $('#corp-loading').css({'display':'none'});
                return;
            }else{
                $('#corporates-error').css({'display':'none'});
            }
            if(angular.isUndefined($rootScope.selectedCity) && !$rootScope.locationModalOpened){
                $('#corp-loading').css({'display':'none'});
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
            var location = $rootScope.selectedCity.city_name + $scope.corporates.area;
            HandyServices.createCorporate($scope.corporates.name, $scope.corporates.email, $scope.corporates.number,
                $scope.corporates.org_name, $scope.corporates.message,location).then(function (response) {
                if(response.success){
                    $('#resultTab').show();
                    $('#tab1').hide();
                }else{
                    $.alert(response.message);
                }
                $('#corp-loading').css({'display':'none'});
            })
        };

    }
})();
