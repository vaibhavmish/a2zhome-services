(function () {
    'use strict';

    angular
        .module('app')
        .factory('HandyServices', HandyServices);

    HandyServices.$inject = ['$http', '$rootScope'];
    function HandyServices($http, $rootScope) {
        var service = {};

        service.requestCallback = requestCallback;
        service.getServiceListCitywise = getServiceListCitywise;
        service.getReviewsListServiceIDwise = getReviewsListServiceIDwise;
        service.postReview = postReview;
        service.searchServices = searchServices;
        service.bookService = bookService;
        service.postFeedback = postFeedback;
        service.getEnabledCities = getEnabledCities;
        service.uploadImagetoAmazonS3 = uploadImagetoAmazonS3;
        service.createCorporate = createCorporate;
        service.createHMP = createHMP;
        service.createPartner = createPartner;
        service.createPackage = createPackage;
        service.sendMessage = sendMessage;
        service.sendAppLink = sendAppLink;
        service.getTestimonials = getTestimonials;
        service.getOurClients = getOurClients;
        service.getOurCustomers = getOurCustomers;
        service.updateUserInfo = updateUserInfo;
        service.updateUserImage = updateUserImage;
        return service;

        function requestCallback(name,email,mobile,location,user_id) {
            return $http({
                url: $rootScope.baseurl+'/request/callback',
                method: 'POST',
                data: $.param({"name":name,"email":email,"mobile":mobile,"location":location,"user_id":user_id}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in request callback processing.'));
        }

        function getServiceListCitywise(city) {
            return $http({
                url: $rootScope.baseurl+'/services/all?city='+city,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in getting service list city wise.'));
        }

        function getReviewsListServiceIDwise(service_id) {
            return $http({
                url: $rootScope.baseurl+'/service/reviews?service_id='+service_id,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in getting reviews list service wise.'));
        }


        function postReview(user_id, service_id, rating, message) {
            return $http({
                url: $rootScope.baseurl+'/review',
                method: 'POST',
                data: $.param({"cus_id":user_id,"service_id":service_id,"rating":rating,"message":message}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in request callback processing.'));
        }

        function searchServices(city,name,type) {
            if(angular.isUndefined(type)){
                var finalURL = $rootScope.baseurl+'/services/search?city='+city+'&name='+name;
            }else{
                var finalURL = $rootScope.baseurl+'/services/search?city='+city+'&name='+name+'&enabled=true';
            }
            return $http({
                url: finalURL,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in searching services according to query.'));
        }

        function bookService(user_id, service_id, scheduled_date, scheduled_time, reason, address) {
            return $http({
                url: $rootScope.baseurl+'/book/service',
                method: 'POST',
                data: $.param({"user_id":user_id,"service_id":service_id,"scheduled_date":scheduled_date,"scheduled_time":scheduled_time,"reason":reason,"address":address}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in booking service.'));
        }

        function postFeedback(type, name, email, mob, message) {
            return $http({
                url: $rootScope.baseurl+'/feedback',
                method: 'POST',
                data: $.param({"type":type,"name":name,"email":email,"number":mob,"message":message}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in posting feedback.'));
        }

        function getEnabledCities() {
            return $http({
                url: $rootScope.baseurl+'/locations/enabled',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in getting cities list.'));
        }

        function uploadImagetoAmazonS3(user_id, imageFile) {
            var fd = new FormData();
            var uploadUrl = $rootScope.baseurl+'/image?id='+user_id;
            fd.append('file', imageFile);
            return $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(handleSuccess,handleError('Error in uploading image in amazon bucket.'));
        }

        function createCorporate(name, email, number, org_name, message, location) {
            return $http({
                url: $rootScope.baseurl+'/create/corporate',
                method: 'POST',
                data: $.param({"name":name,"email":email,"mobile":number,"org_name":org_name,"message":message,"location":location}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in creating corporate enquiry.'));
        }

        function createHMP(name, email, number, message, location) {
            return $http({
                url: $rootScope.baseurl+'/create/hmp',
                method: 'POST',
                data: $.param({"name":name,"email":email,"mobile":number,"message":message,"location":location}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in creating corporate enquiry.'));
        }

        function createPartner(name, email, number, message, location) {
            return $http({
                url: $rootScope.baseurl+'/create/partner',
                method: 'POST',
                data: $.param({"name":name,"email":email,"mobile":number,"message":message,"location":location}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in creating corporate enquiry.'));
        }

        function createPackage(type, area, duration, total) {
            return $http({
                url: $rootScope.baseurl+'/create/package',
                method: 'POST',
                data: $.param({"type":type,"area":area,"duration":duration,"total":total}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in creating corporate enquiry.'));
        }

        function sendMessage(name, email, number, message, location) {
            return $http({
                url: $rootScope.baseurl+'/save/message',
                method: 'POST',
                data: $.param({"name":name,"email":email,"phone":number,"message":message,"location":location}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in creating corporate enquiry.'));
        }

        function sendAppLink(number) {
            return $http({
                url: $rootScope.baseurl+'/send/link?number='+number,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in creating corporate enquiry.'));
        }

        //Media Coverage
        function getTestimonials() {
            return $http({
                url: $rootScope.baseurl+'/testimonials',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in creating corporate enquiry.'));
        }

        // Our Customers
        function getOurCustomers() {
            return $http({
                url: $rootScope.baseurl+'/reviews',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in creating corporate enquiry.'));
        }

        // Our Clients
        function getOurClients() {
            return $http({
                url: $rootScope.baseurl+'/client',
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in creating corporate enquiry.'));
        }

        function updateUserInfo(id,name, number, email) {
            return $http({
                url: $rootScope.baseurl+'/user/update?id='+id,
                method: 'POST',
                data:$.param({"name":name,"number":number,"email":email}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in creating corporate enquiry.'));
        }

        function updateUserImage(id,photo) {
            return $http({
                url: $rootScope.baseurl+'/user/update?id='+id,
                method: 'POST',
                data:({"photo":photo}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in creating corporate enquiry.'));
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