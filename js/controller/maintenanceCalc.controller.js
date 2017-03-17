/**
 * Created by hanshika on 09/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('MaintenanceCalculatorController',MaintenanceCalculatorController);

    MaintenanceCalculatorController.$inject=['$rootScope','$scope','$location','$route'];
    function MaintenanceCalculatorController($rootScope, $scope, $location, $route) {
        var vm = this;
        vm.user = null;

        $('#rootwizard').bootstrapWizard({onTabShow: function(tab, navigation, index) {
            var $total = navigation.find('li').length;
            var $current = index+1;
            var $percent = ($current/$total) * 100;
            $('#rootwizard .progress .progress-bar').css({width:$percent+'%'});
        }});

        $scope.properties = ['Home','Society','Offices','Commercial Complex'];

        $scope.selectTypeofProperty = function () {
            $scope.propertiesChosen = [];
            if(angular.isUndefined($scope.propertyChoosing)){
                $.alert("Please Choose type of Property");
            }else {
                for(var i=0;i<$scope.properties.length;i++){
                    if ($scope.propertyChoosing[$scope.properties[i]]) {
                        $scope.propertiesChosen.push($scope.properties[i]);
                    }
                }
                if($scope.propertiesChosen.length > 0) {
                    $('#property').data('target', '#tab2');
                }else{
                    $.alert("Please Choose type of Property");
                }
            }
        };

        $scope.services = ['AC Service','Pest Control','Plumbing','Carpentry','RO / Water Purifier'];

        $scope.selectServices = function () {
            $scope.servicesChosen = [];
            if(angular.isUndefined($scope.propertyChoosing)){
                $.alert("Please Choose type of Services");
            }else {
                for(var i=0;i<$scope.services.length;i++){
                    if ($scope.servicesChoosing[$scope.services[i]]) {
                        $scope.servicesChosen.push($scope.services[i]);
                    }
                }
                if($scope.servicesChosen.length > 0) {
                    $('#services').data('target','#tab3');
                }else{
                    $.alert("Please Choose type of Services");
                }
            }
        };

        $scope.requirements = ['3 Months','6 Months','12 Months'];

        $scope.selectRequirements = function () {
            $scope.requirementsChosen = [];
            if(angular.isUndefined($scope.propertyChoosing)){
                $.alert("Please Choose Package Duration");
            }else {
                for(var i=0;i<$scope.requirements.length;i++) {
                    if ($scope.requirementsChoosing[$scope.requirements[i]]) {
                        $scope.requirementsChosen.push($scope.requirements[i]);
                    }
                }
                if($scope.requirementsChosen.length > 0) {
                    $('#requirements').data('target','#tab4');
                }else{
                    $.alert("Please Choose Package Duration");
                }
            }
        };

        $scope.requiredServices = ['15','30','Unlimited'];

        $scope.getQuote = function () {
            $scope.requiredServicesChosen = [];
            if(angular.isUndefined($scope.propertyChoosing)){
                $.alert("Please Choose Required Services");
            }else {
                for(var i=0;i<$scope.requiredServices.length;i++){
                    if ($scope.requiredServicesChoosing[$scope.requiredServices[i]]) {
                        $scope.requiredServicesChosen.push($scope.requiredServices[i]);
                    }
                }
                if($scope.requiredServicesChosen.length > 0) {
                    $('#quote').data('target','#resultTab');
                }else{
                    $.alert("Please Choose Required Services");
                }
            }
        };
    }
})();
