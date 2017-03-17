/**
 * Created by hanshika on 09/03/2017
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('CorporatesController',CorporatesController);

    CorporatesController.$inject=['$rootScope','$scope'];
    function CorporatesController($rootScope, $scope) {
        var vm = this;
        vm.user = null;
    }
})();
