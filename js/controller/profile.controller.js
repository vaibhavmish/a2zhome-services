/**
 * Created by hanshika on 10/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('ProfileController',ProfileController);

    ProfileController.$inject=['$rootScope','$scope','$location','HandyServices','GoogleSignin'];
    function ProfileController($rootScope, $scope, $location, HandyServices,GoogleSignin) {
        var vm = this;
        vm.user = null;

        $('#profileEdit').hide();
        $('#imageUpload').hide();

        if(!angular.isUndefined($rootScope.user)){
            $scope.user = $rootScope.user;
            // if(angular.isUndefined($scope.user.image)){
            //     $scope.user.image = "http://alpha.handyservices.in/s_image/32298.jpg";
            // }
        }else{
            $location.path("/");
        }

        if(!angular.isUndefined($rootScope.selectedCity)){
            $scope.selectedCity = $rootScope.selectedCity;
        }


        $scope.$watch(function () {
            return $rootScope.user;
        }, function(){
            if(!angular.isUndefined($rootScope.user)){
                $scope.user = $rootScope.user;
                // if(angular.isUndefined($scope.user.image)){
                //     $scope.user.image = "http://alpha.handyservices.in/s_image/32298.jpg";
                // }
            }
        }, true);

        $scope.$watch(function () {
            return $rootScope.selectedCity;
        }, function(){
            if(!angular.isUndefined($rootScope.selectedCity)){
                $scope.selectedCity = $rootScope.selectedCity;
            }
        }, true);

        $scope.openLocationModal = function () {
            if(angular.isUndefined($rootScope.selectedCity) && !$rootScope.locationModalOpened) {
                $('#location').css({'visibility':'hidden'});
                var modal = ModalService.showModal({
                    templateUrl: "templates/location.modal.html",
                    controller: "LocationController"
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                        $('#location').css({'visibility':'visible'});
                    });
                });
            }
        };

        $scope.LogoutUser = function () {
            if($rootScope.user && $rootScope.user.fb_id){
                FB.logout(function(response) {
                    $scope.user = null;
                    $rootScope.loginModalOpened = false;
                    $rootScope.user = undefined;
                });
            }else if($rootScope.user && $rootScope.user.google_id) {
                $scope.user = null;
                $rootScope.loginModalOpened = false;
                $rootScope.user = undefined;
                GoogleSignin.signOut().then(function (user) {
                    console.log(user);
                }, function (err) {
                    console.log(err);
                });
            }else{
                $scope.user = null;
                $rootScope.loginModalOpened = false;
                $rootScope.user = undefined;
            }
            $location.path("/");
        };

        $scope.ChangeLocation = function () {
            $scope.selectedCity = null;
            $rootScope.locationModalOpened = false;
            $rootScope.selectedCity = undefined;
            $scope.openLocationModal();
        };

        $scope.uploadImage = function (image) {
            HandyServices.uploadImagetoAmazonS3($scope.user._id,image).then(function (response) {
                if(response.success){
                    console.log(response);
                    $scope.user.image = response.data;
                    $rootScope.user = $scope.user;
                    $.alert("Image uploaded successfully");
                    HandyServices.updateUserImage($scope.user._id,$scope.user.image).then(function (response) {
                        if (response.success) {
                            $rootScope.user = $scope.user;
                            $('#profileEdit').hide();
                            $('#profileView').show();
                        }else{
                            $.alert(response.message);
                        }
                    });
                }else{
                    $.alert(response.message);
                }
            });
            $('#imageUpload').hide();
        };

        $scope.showUploadImage = function () {
            $('#imageUpload').show();
        };

        $scope.editProfileInfo = function () {
            $('#profileEdit').show();
            $('#profileView').hide();
        };

        $scope.submitInfo = function () {
            if(angular.isUndefined($scope.user) || angular.isUndefined($scope.user.name) || angular.isUndefined($scope.user.email)
             || angular.isUndefined($scope.user.number)){
                $('#error').show();
                return;
            }
            HandyServices.updateUserInfo($scope.user._id,$scope.user.name, $scope.user.number, $scope.user.email).then(function (response) {
                if (response.success) {
                    $rootScope.user = $scope.user;
                    $('#profileEdit').hide();
                    $('#profileView').show();
                }else{
                    $.alert(response.message);
                }
            });
        };

        $('input:file').change( function(e) {
            $scope.uploadImage(e.target.files[0]);
        });

    }
})();
