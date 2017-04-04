/**
 * Created by hanshika on 09/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('MaintenanceCalculatorController',MaintenanceCalculatorController);

    MaintenanceCalculatorController.$inject=['$rootScope','$scope','$location','ModalService'];
    function MaintenanceCalculatorController($rootScope, $scope, $location,ModalService) {
        var vm = this;
        vm.user = null;

        $('#rootwizard').bootstrapWizard({onTabShow: function(tab, navigation, index) {
            var $total = navigation.find('li').length;
            var $current = index+1;
            var $percent = ($current/$total) * 100;
        }});

        $scope.properties = ['Home','Society','Offices','Commercial Complex'];

        $scope.selectTypeofProperty = function () {
            if(angular.isUndefined($scope.propertyChoosen)){
                $('#property-error').html("Please Choose type of Property");
                $('#property-error').css({'display':'block'});
                return;
            }else {
                $('#property-error').css({'display':'none'});
                if($scope.propertyChoosen === 'Home') {
                    $("#tabHead1").removeClass("active");
                    $("#tabHead2").addClass("active");
                    $('#property').data('target', '#tab2');
                    $('#rootwizard .progress .progress-bar').css({width: '50%'});
                }else{
                    ModalService.showModal({
                        templateUrl: "templates/maintenanceCalcAddress.modal.html",
                        controller: "MaintenanceCalculatorAddressController"
                    }).then(function (modal) {
                        modal.element.modal();
                        modal.close.then(function (result) {
                            $scope.yesNoResult = result ? "You said Yes" : "You said No";
                        });
                    });
                }
            }
        };

        $scope.services = ['AC Service','Pest Control','Plumbing','Carpentry','RO / Water Purifier'];

        $scope.servicesChoosing = [];

        $scope.selectServices = function () {
            $scope.servicesChosen = [];
            if(angular.isUndefined($scope.servicesChoosing)){
                $('#serv-error').html("Please Choose type of Services");
                $('#serv-error').css({'display':'block'});
                return;
            }else {
                $('#serv-error').css({'display':'none'});
                for(var i=0;i<$scope.services.length;i++){
                    if ($scope.servicesChoosing[$scope.services[i]]) {
                        $scope.servicesChosen.push($scope.services[i]);
                    }
                }
                if($scope.servicesChosen.length > 0) {
                    $("#tabHead2").removeClass("active");
                    $("#tabHead3").addClass("active");
                    $('#services').data('target','#tab3');
                    $('#rootwizard .progress .progress-bar').css({width:'75%'});
                }else{
                    $('#serv-error').html("Please Choose type of Services");
                    $('#serv-error').css({'display':'block'});
                    return;
                }
            }
        };

        $scope.requirements = ['3 Months','6 Months','12 Months'];

        $scope.requirementsChoosing = [];

        $scope.selectRequirements = function () {
            $scope.requirementsChosen = [];
            if(angular.isUndefined($scope.requirementsChoosing)){
                $('#req-error').html("Please Choose Package Duration");
                $('#req-error').css({'display':'block'});
                return;
            }else {
                $('#req-error').css({'display':'none'});
                for(var i=0;i<$scope.requirements.length;i++) {
                    if ($scope.requirementsChoosing[$scope.requirements[i]]) {
                        $scope.requirementsChosen.push($scope.requirements[i]);
                    }
                }
                if($scope.requirementsChosen.length > 0) {
                    $("#tabHead3").removeClass("active");
                    $("#tabHead4").addClass("active");
                    $('#requirements').data('target','#tab4');
                    $('#rootwizard .progress .progress-bar').css({width:'100%'});
                }else{
                    $('#req-error').html("Please Choose Package Duration");
                    $('#req-error').css({'display':'block'});
                    return;
                }
            }
        };

        $scope.requiredServices = ['15','30','Unlimited'];

        $scope.requiredServicesChoosing = [];

        $scope.getQuote = function () {
            $scope.requiredServicesChosen = [];
            if(angular.isUndefined($scope.requiredServicesChoosing)){
                $('#reqServ-error').html("Please Choose Required Services");
                $('#reqServ-error').css({'display':'block'});
                return;
            }else {
                $('#reqServ-error').css({'display':'none'});
                for(var i=0;i<$scope.requiredServices.length;i++){
                    if ($scope.requiredServicesChoosing[$scope.requiredServices[i]]) {
                        $scope.requiredServicesChosen.push($scope.requiredServices[i]);
                    }
                }
                if($scope.requiredServicesChosen.length > 0) {
                    $('#quote').data('target','#resultTab');
                    $('#rootwizard .progress').css({display:'none'});
                    $('#nav-header').css({display:'none'});
                }else{
                    $('#reqServ-error').html("Please Choose Required Services");
                    $('#reqServ-error').css({'display':'block'});
                    return;
                }
            }
        };

        $scope.addPackage = function () {
            $rootScope.selectedPackage = {};
            $rootScope.selectedPackage = {
                property: $scope.propertyChoosen,
                services: $scope.servicesChosen,
                duration: $scope.requirementsChosen,
                countService: $scope.requiredServicesChosen,
                area: $scope.area
            };
            ModalService.showModal({
                templateUrl: "templates/maintenanceCalcAddress.modal.html",
                controller: "MaintenanceCalculatorAddressController"
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    $scope.yesNoResult = result ? "You said Yes" : "You said No";
                });
            });
        }
    }
})();
