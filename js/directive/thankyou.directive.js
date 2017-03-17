/**
 * Created by hanshika on 09/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .directive('thankYou',ThankYouDirective);

    function ThankYouDirective($rootScope) {
        return{
            restrict: 'E',
            controller: 'ThankYouController',
            templateUrl: 'templates/thankyou.view.html'
        };
    }
})();
