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
            if(angular.isUndefined($rootScope.selectedCity)){
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
                    $('#corporates').data('target','#resultTab');
                }else{
                    $.alert(response.message);
                }
            })
        };

    }
})();
