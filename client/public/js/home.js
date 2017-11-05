(function() {
    'use strict';

    angular
        .module('mb')
        .controller('Home', Home);

  Home.$inject = ['$http', 'activitySrv'];

    /* @ngInject */
    function Home($http, activitySrv) {
        var vm = this;
        vm.activities = []
        activate();

        function activate() {
          $http.get('http://e03542f3.ngrok.io/api/SalesAgreement?filter=%7B%22buyer%22%3A%22string%22%7D')
                .then(function(res){
                  vm.timeline = res.data
                })
        }
    }
})();
