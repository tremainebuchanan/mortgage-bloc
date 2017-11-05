(function() {
    'use strict';

    angular
        .module('mb')
        .controller('Notification', Notification);

  //  Notification.$inject = ['dependencies'];

    /* @ngInject */
    function Notification() {
        var vm = this;

        activate();

        function activate() {
          console.log('Notification')
        }
    }
})();
