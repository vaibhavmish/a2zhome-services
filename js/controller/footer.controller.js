/**
 * Created by hanshika on 09/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('FooterController',FooterController);

    FooterController.$inject=['$rootScope','$scope','HandyServices'];
    function FooterController($rootScope, $scope, HandyServices) {
        var vm = this;
        vm.user = null;

    }
})();
