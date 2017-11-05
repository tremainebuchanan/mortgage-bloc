(function() {
    'use strict';

    angular.module('mb', [
            'ngRoute'
        ]).config(config)
        .run(getActiveTab)

    function config($routeProvider, $httpProvider) {
      $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

        $routeProvider.when('/timeline', {
          controller: 'Home as vm',
          templateUrl: 'js/templates/home.html'
          // resolve: {
          //   activities: function(activitySrv){
          //     return activitySrv.getCommodities()
          //   }
          // }
        }).when('/work-items', {
          controller: 'WorkItem as vm',
          templateUrl: 'js/templates/home.html'
        }).when('/notifications', {
          controller: 'Notification as vm',
          templateUrl: 'js/templates/home.html'
        }).when('/purchase', {
          controller: 'Purchase as vm',
          templateUrl: 'js/templates/purchase.html'
        }).otherwise({redirectTo: '/timeline'})

    }

    /**
     * Extracts tab identifier from a given URL
     * @param  {[type]} $rootScope [description]
     * @param  {[type]} $location  [description]
     * @return {[type]}            [description]
     */
    function getActiveTab( $rootScope, $location ) {
      var path = function() { return $location.path() }
      $rootScope.$watch(path, function(newURL, oldURL){
        console.log(newURL)
        var url = newURL.split('/')
        if(url.length > 0 ) $rootScope.activetab = url[1]
      })
    }

})();
