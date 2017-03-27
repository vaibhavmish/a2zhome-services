/**
 * Created by hanshika on 10/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('FeedbackController',FeedbackController);

    FeedbackController.$inject=['$rootScope','$scope','$location','HandyServices'];
    function FeedbackController($rootScope, $scope, $location, HandyServices) {
        var vm = this;
        vm.user = null;

        $scope.postFeedback = function () {
            $('#feed-loading').css({'display':'block'});
            if(angular.isUndefined($scope.feedback) || angular.isUndefined($scope.feedback.email) || angular.isUndefined($scope.feedback.name)
                || angular.isUndefined($scope.feedback.mob) || angular.isUndefined($scope.feedback.message) ){
                $('#feedback-error').css({'display':'block'});
                $('#feed-loading').css({'display':'none'});
                return;
            }else{
                $('#feedback-error').css({'display':'none'});
            }
            if($scope.type1){
                var type = "Services";
            }else if($scope.type2){
                var type = "User Experience";
            }else if($scope.type3){
                var type = "Functionality";
            }else if($scope.type4){
                var type = "Others";
            }else{
                $('#feed-loading').css({'display':'none'});
                $.alert("Please choose feedback type");
                return;
            }
            HandyServices.postFeedback(type, $scope.feedback.name, $scope.feedback.email, $scope.feedback.mob, $scope.feedback.message).then(function (response) {
                console.log(response);
                if(response.success){
                    $.alert("Thanks for your Feedback!");
                    $location.path('/home');
                }else{
                    $.alert("Sorry!! Feedback Recording Failed.")
                }
                $('#feed-loading').css({'display':'none'});
            })
        }
    }
})();
