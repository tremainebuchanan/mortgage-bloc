(function() {
    'use strict';

    angular
        .module('mb')
        .service('activitySrv', activitySrv);

    activitySrv.$inject = ['$http'];

    /* @ngInject */
    function activitySrv($http) {
        var service = {
          getCommodities:getCommodities
        }

        return service

        function getCommodities() {
          var apiUrl = 'http://b5442301.ngrok.io/api/'
          return $http.get(apiUrl + 'system/historian').then(function(res){
            return res.data
          })
        }
    }
})();
