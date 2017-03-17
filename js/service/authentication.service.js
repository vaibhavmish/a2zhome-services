(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$rootScope'];
    function AuthenticationService($http, $rootScope) {
        var service = {};

        service.sendOTP = sendOTP;
        service.verifyOTP = verifyOTP;
        service.userLogin = userLogin;
        service.userRegister = userRegister;
        service.forgotPassword = forgotPassword;
        service.resetPassword = resetPassword;

        return service;

        function sendOTP(number) {
            return $http({
                url: $rootScope.baseurl+'/send/otp',
                method: 'POST',
                data: $.param({"number":number}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error sending otp.'));
        }

        function verifyOTP(id, otp) {
            return $http({
                url: $rootScope.baseurl+'/verify/otp',
                method: 'POST',
                data: $.param({"id":id,"otp":otp}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error verifying otp.'));
        }

        function userLogin(email,password) {
            return $http({
                url: $rootScope.baseurl+'/user/login',
                method: 'POST',
                data: $.param({"email":email,"password":password}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in user login.'));
        }

        function userRegister(name, email, number, password) {
            return $http({
                url: $rootScope.baseurl+'/user/register',
                method: 'POST',
                data: $.param({"name":name,"email":email,"number":number,"password":password}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in user registration.'));
        }

        function forgotPassword(email) {
            return $http({
                url: $rootScope.baseurl+'/user/forgot-password',
                method: 'POST',
                data: $.param({"email":email}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in forgot password processing.'));
        }

        function resetPassword(email, password) {
            return $http({
                url: $rootScope.baseurl+'/user/reset-password',
                method: 'POST',
                data: $.param({"email":email,"password":password}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in reset password processing.'));
        }

        // private functions

        function handleSuccess(res) {
            return {"success": true, "data": res.data };
        }

        function handleError(error) {
            return {"success": false, "message": error };
        }
    }

})();