/**
 * Created by hanshika on 09/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .directive('appFooter',AppFooterDirective);

    function AppFooterDirective($rootScope) {
        return{
            restrict: 'E',
            controller: 'FooterController',
            templateUrl: 'templates/footer.view.html'
        };
    }
})();
