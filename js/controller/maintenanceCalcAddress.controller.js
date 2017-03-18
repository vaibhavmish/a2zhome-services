/**
 * Created by hanshika on 16/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('MaintenanceCalculatorAddressController',MaintenanceCalculatorAddressController);

    MaintenanceCalculatorAddressController.$inject=['$rootScope','$scope','ModalService','HandyServices'];
    function MaintenanceCalculatorAddressController($rootScope, $scope,ModalService,HandyServices) {
        var vm = this;
        vm.user = null;

        $scope.$watch(function () {
            return $rootScope.user;
        }, function(){
            if(!angular.isUndefined($rootScope.user)){
                $scope.user = $rootScope.user;
            }
        }, true);

        $('#rootwizard2').bootstrapWizard({onTabShow: function(tab, navigation, index) {
            var $total = navigation.find('li').length;
            var $current = index+1;
            var $percent = ($current/$total) * 100;
            $('#rootwizard3 #bar .progress .progress-bar').css({width:$percent+'%'});
        }});

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

        if(!angular.isUndefined($rootScope.selectedService)){
            $scope.selectedService = $rootScope.selectedService;
        }

        $scope.addAddress = function () {
            if(angular.isUndefined($scope.mCalc.houseno) ||
                angular.isUndefined($scope.mCalc.city) ||
                angular.isUndefined($scope.mCalc.state) ||
                angular.isUndefined($scope.mCalc.datetime)){
                return;
            }else{
                $scope.mainAddress = $scope.mCalc.houseno + " , "
                $scope.mCalc.society + " , "
                $scope.mCalc.city + " , "
                $scope.mCalc.landmark + " , "
                $scope.mCalc.state;

                ModalService.showModal({
                    templateUrl: "templates/thankyou.modal.html",
                    controller: "ThankYouController"
                }).then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        $scope.yesNoResult = result ? "You said Yes" : "You said No";
                    });
                });
            }
        };


    }
})();
