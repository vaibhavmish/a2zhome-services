/**
 * Created by hanshika on 10/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController',LoginController);

    LoginController.$inject=['$rootScope','$scope','$location','AuthenticationService','ModalService'];
    function LoginController($rootScope, $scope, $location,AuthenticationService,ModalService) {
        var vm = this;
        vm.user = null;
        $scope.user = null;

        $( "#tabs" ).tabs();

        $scope.openBlock = function(evt, stateName) {
            var i, tabcontent, tablinks;
            tabcontent = document.getElementsByClassName("tabcontent");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }
            tablinks = document.getElementsByClassName("tablinks");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
            document.getElementById(stateName).style.display = "block";
            // evt.currentTarget.className += " active";
        };

        $scope.openOTPModal = function () {
            console.log("otp modal opened");
            ModalService.showModal({
                templateUrl: "templates/otpverify.modal.html",
                controller: "LoginController"
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    $scope.yesNoResult = result ? "You said Yes" : "You said No";
                });
            });
        };

        $scope.sendOTP = function () {
            AuthenticationService.sendOTP($scope.user.number).then(function (response) {
                if(response.success){
                    $rootScope.temps.user = $scope.user;
                    $rootScope.otpId = response.data;
                    ModalService.showModal({
                        templateUrl: "templates/otpverify.modal.html",
                        controller: "LoginController"
                    }).then(function(modal) {
                        modal.element.modal();
                        modal.close.then(function(result) {
                            // $scope.yesNoResult = result ? "You said Yes" : "You said No";
                        });
                    });
                }else {
                    $.alert(response.message);
                    $scope.user = null;
                }
            })
        };

        $scope.verifyOTP = function () {
          AuthenticationService.verifyOTP($rootScope.otpId,$scope.otpEntered).then(function (response) {
              if(response.success){
                  $scope.user = $rootScope.temps.user;
                  AuthenticationService.userRegister($scope.user.name,$scope.user.email,$scope.user.number,$scope.user.password).then(function (response) {
                      if(response.success){
                          $.alert("Successfully Registered!!");
                          $rootScope.user = $scope.user;
                      }else{
                          $.alert(response.message);
                      }
                  })
              }else{
                  $.alert(response.message);
                  $scope.user = null;
              }
          })
        };

        $scope.userLogin = function () {
            AuthenticationService.userLogin($scope.loginUser.email,$scope.loginUser.password).then(function (response) {
                if(response.success){
                    $.alert("Logged in successfully");
                    $rootScope.user = response.data;
                    $rootScope.temps.user = response.data;
                }else{
                    $.alert(response.message);
                    $scope.user = null;
                }
            })
        }

    }
})();
