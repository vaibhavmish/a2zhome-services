/**
 * Created by hanshika on 16/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('BookServiceController',BookServiceController);

    BookServiceController.$inject=['$rootScope','$scope','ModalService','HandyServices','close'];
    function BookServiceController($rootScope, $scope,ModalService,HandyServices,close) {
        var vm = this;
        vm.user = null;

        $scope.closeModal = function(result) {
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };

        $scope.format = 'MMM d, y h:mm:ss a';

        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }


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
            $('#rootwizard2 #bar .progress .progress-bar').css({width:$percent+'%'});
        }});


        if(!angular.isUndefined($rootScope.selectedService)){
          $scope.selectedService = $rootScope.selectedService;
        }

        $scope.$watch(function () {
            return $rootScope.selectedCity;
        }, function(){
            if(!angular.isUndefined($rootScope.selectedCity)) {
                HandyServices.getServiceListCitywise($rootScope.selectedCity.city_name).then(function (response) {
                    if (response.success) {
                        $scope.services = response.data;
                    }else{
                        $scope.services = null;
                    }
                });
            }
        }, true);

        $scope.isSelectedService = function (service) {
            if(service._id==$scope.selectedService._id){
                return true;
            }
            return false;
        };

        $scope.initializeCheckboxes = function (service) {
            if($scope.isSelectedService(service)){
                $scope.serviceChoosing[service.name]=true;
            }
        };

        $scope.serviceChoosing = [];

        $scope.addServicesChoosen = function () {
            $scope.servicesChosen = [];
            for(var i=0;i<$scope.services.length;i++){
                if($scope.serviceChoosing[$scope.services[i].name]){
                    $scope.servicesChosen.push($scope.services[i]);
                }
            }
            if($scope.servicesChosen.length>0){
                $('#services-error').hide();
                $('#rootwizard2 #bar').css({width:'66%'});
                $("#tab2").show();
                $("#tab1").hide();
            }else{
                $('#services-error').show();
                return;
            }
        };

        $scope.addAddress = function () {
          if(angular.isUndefined($scope.bservice) ||
              angular.isUndefined($scope.bservice.houseno) ||
                  angular.isUndefined($scope.bservice.society) ||
                  angular.isUndefined($scope.bservice.city) ||
                  angular.isUndefined($scope.bservice.landmark) ||
                angular.isUndefined($scope.bservice.state) ||
                angular.isUndefined($scope.bservice.datetime)){
              $('#bookserv-error').css({'display':'block'});
              return;
          }else{
              $('#bookserv-error').css({'display':'none'});
              $scope.mainAddress = $scope.bservice.houseno + " , "
                                    $scope.bservice.society + " , "
                                    $scope.bservice.city + " , "
                                    $scope.bservice.landmark + " , "
                                    $scope.bservice.state;
              if(!angular.isUndefined($scope.mainAddress)){
                  $('#rootwizard2 #bar').css({width:'100%'});
                  $("#tab3").show();
                  $("#tab2").hide();
              }else{
                  return;
              }
          }
        };

        $scope.confirmOrder = function () {
            if(!angular.isUndefined($rootScope.user)) {
                if(!angular.isUndefined($rootScope.selectedCity)) {
                    var date = new Date($scope.bservice.datetime);
                    var serviceDate = date.getDate();
                    var serviceTime = date.getTime();
                    HandyServices.bookService($rootScope.user._id,$rootScope.selectedService._id,serviceDate,serviceTime,"service needed",$scope.mainAddress).then(function (response) {
                        if(response.success){
                            // ModalService.showModal({
                            //     templateUrl: "templates/thankyou.modal.html",
                            //     controller: "ThankYouController"
                            // }).then(function(modal) {
                            //     modal.element.modal();
                            //     modal.close.then(function(result) {
                            //         $scope.yesNoResult = result ? "You said Yes" : "You said No";
                            //     });
                            // });
                            $("#resultTab").show();
                            $("#tab3").hide();
                        }else{
                            $.alert("Booking failed");
                            return;
                        }
                    })
                }else{
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
            }else if(!$rootScope.loginModalOpened){
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
        }

    }
})();
