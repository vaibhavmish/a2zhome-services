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

            HandyServices.requestCallback($scope.rc.name,$scope.rc.email,$scope.rc.mobile,$rootScope.selectedCity,$rootScope.user.user_id).then(function (response) {
                console.log(response);
                if(response.success){
                    $.alert("Our team will soon contact you!!");
                }else{
                    $.alert(response.message);
                }
            })

        }
    }
})();
