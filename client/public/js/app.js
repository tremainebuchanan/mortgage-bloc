(function() {
    'use strict';

    angular.module('mb', [
            'ngRoute'
        ]).config(config)

    function config($routeProvider) {
        $routeProvider.when('/', {
          controller: 'Home as vm',
          templateUrl: 'js/templates/home.html'
        })
    }
})();
