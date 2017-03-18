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
            return $http({
                url: $rootScope.baseurl+'/image',
                method: 'POST',
                data: $.param({"user_id":user_id}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
            }).then(handleSuccess, handleError('Error in uploading image in amazon bucket.'));
        }

        function createCorporate(name, email, number, org_name, message, location) {
            return $http({
                url: $rootScope.baseurl+'/create/corporate',
                method: 'POST',
                data: $.param({"name":name,"email":email,"mobile":number,"org_name":org_name,"message":message,"location":location}),
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