/**
 * Created by hanshika on 10/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController',LoginController);

    LoginController.$inject=['$rootScope','$scope','AuthenticationService','ModalService','close','GoogleSignin','HandyServices'];
    function LoginController($rootScope, $scope,AuthenticationService,ModalService,close,GoogleSignin,HandyServices) {
        var vm = this;
        vm.user = null;

        $scope.closeModal = function(result) {
            $rootScope.loginModalOpened = true;
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            close(result, 500); // close, but give 500ms for bootstrap to animate
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
            if(angular.isUndefined($scope.user) || angular.isUndefined($scope.user.email) || angular.isUndefined($scope.user.password)
                || angular.isUndefined($scope.user.number) || angular.isUndefined($scope.user.name) ){
                $('#register-error').css({'display':'block'});
                return;
            }else{
                $('#register-error').css({'display':'none'});
            }
            $('#login-loading').css({'display':'block'});
            $('#login-or').css({'display':'none'});
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
                          if(response.data._id) {
                              $.alert("Successfully Registered!!");
                              $rootScope.user = $scope.user;
                          }else{
                              $.alert(response.data);
                          }
                      }else{
                          $.alert("Registration Failed: "+response.message);
                      }
                      $('#login-loading').css({'display':'none'});
                      $('#login-or').css({'display':'block'});
                  })
              }else{
                  $.alert("Registration Failed: "+response.message);
                  $scope.user = null;
              }
          });
            setTimeout(function () {
                $('#login-loading').css({'display':'none'});
                $('#login-or').css({'display':'block'});
                $.alert("Registration Failed.");
                $scope.user = null;
            },10000);
            $scope.closeModal('Cancel');
        };

        $scope.userLogin = function () {
            if(angular.isUndefined($scope.loginUser) || angular.isUndefined($scope.loginUser.email) || angular.isUndefined($scope.loginUser.password)){
                $('#login-error').css({'display':'block'});
                return;
            }else{
                $('#login-error').css({'display':'none'});
            }
            $('#login-loading').css({'display':'block'});
            $('#login-or').css({'display':'none'});
            AuthenticationService.userLogin($scope.loginUser.email,$scope.loginUser.password).then(function (response) {
                if(response.success){
                    if(response.data._id) {
                        $rootScope.loginModalOpened = true;
                        $.alert("Logged in successfully via Email");
                        $rootScope.user = response.data;
                        $rootScope.temps.user = response.data;
                    }else{
                        $.alert("Login Failed: "+response.data);
                    }
                    $('#login-loading').css({'display':'none'});
                    $('#login-or').css({'display':'block'});
                }else{
                    $('#login-loading').css({'display':'none'});
                    $('#login-or').css({'display':'block'});
                    $.alert(response.message);
                    $scope.user = null;
                }
            });
            setTimeout(function () {
                $('#login-loading').css({'display':'none'});
                $('#login-or').css({'display':'block'});
                $.alert("Login Failed.");
                $scope.user = null;
            },5000);
            $scope.closeModal('Cancel');
        };


        $scope.fbLogin = function () {
            $('#login-loading').css({'display':'block'});
            $('#login-or').css({'display':'none'});
            var access_token, user_id, user_email;
            FB.login(function(response) {

                if (response.authResponse) {
                    console.log('Welcome!  Fetching your information.... ');
                    //console.log(response); // dump complete info
                    access_token = response.authResponse.accessToken; //get access token
                    user_id = response.authResponse.userID; //get FB UID

                    FB.api('/me', function(response) {
                        $scope.user = {
                            fb_id:response.id,
                            name:response.name,
                            email:response.email,
                            fblogin:true
                        };
                    });

                    AuthenticationService.registerFBUser($scope.user.name,$scope.user.email,$scope.user.fb_id).then(function (response) {
                       if(response.success){
                           $('#login-loading').css({'display':'none'});
                           $('#login-or').css({'display':'block'});
                           $rootScope.loginModalOpened = true;
                           $scope.user = response.data;
                           $rootScope.user = $scope.user;
                           $.alert("Logged in successfully via FB Login");
                       }else{
                           $('#login-loading').css({'display':'none'});
                           $('#login-or').css({'display':'block'});
                           $.alert(response.message);
                       }
                    });
                } else {
                    //user hit cancel button
                    $('#login-loading').css({'display':'none'});
                    $('#login-or').css({'display':'block'});
                    console.log('User cancelled login or did not fully authorize.');

                }
            }, {
                scope: 'public_profile,email'
            });
            $scope.closeModal('Cancel');
        };

        $scope.openLogin = function () {
            $('#Login').show();
            $('#SignUp').hide();
        };

        $scope.openRegister = function () {
            $scope.user = null;
            $('#Login').hide();
            $('#SignUp').show();
        };

        $scope.openLogin();

        var google_client_id = "336458288373-422f41kjqopb7gernjbgs9hiekgoeic8.apps.googleusercontent.com";
        var google_client_secret = "7HmkLvlIr4BOmjGe_pFrbLRy";

        $scope.processGoogleLogin = function () {
            $('#login-loading').css({'display':'block'});
            $('#login-or').css({'display':'none'});
            GoogleSignin.signIn().then(function (user) {
                $scope.user = {
                    google_id:user.getBasicProfile().getId(),
                    name: user.getBasicProfile().getName(),
                    email: user.getBasicProfile().getEmail(),
                    image: user.getBasicProfile().getImageUrl()
                };
                AuthenticationService.registerGoogleUser($scope.user.name,$scope.user.email,$scope.user.google_id).then(function (res) {
                    if(res.success){
                        if(res.data._id){
                            $scope.user = res.data;
                            $rootScope.user = $scope.user;
                            if(angular.isUndefined($scope.user.image) && user.getBasicProfile().getImageUrl()){
                                HandyServices.updateUserImage($scope.user._id,user.getBasicProfile().getImageUrl()).then(function (res) {
                                    if(res.success){
                                        console.log("User Google Login Successful. User Google Image addition successful");
                                    }else{
                                        console.log("User Google Login Successful. User Google Image addition Failed");
                                    }
                                })
                            }
                            $.alert("Successfully Logged in Via Google");
                        }else{
                            $.alert("Google Login Failed");
                        }
                    }else{
                        $.alert("Google Login Failed");
                    }
                    $('#login-loading').css({'display':'block'});
                    $('#login-or').css({'display':'block'});
                    $scope.closeModal('Cancel');
                })
            }, function (err) {
                console.log(err);
                $.alert("Google Login Failed!!");
                $('#login-loading').css({'display':'block'});
                $('#login-or').css({'display':'block'});
                $scope.closeModal('Cancel');
            });
        }

    }
})();
