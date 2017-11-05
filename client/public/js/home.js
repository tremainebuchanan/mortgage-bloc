(function() {
    'use strict';

    angular
        .module('mb')
        .controller('Home', Home);

  //  Home.$inject = ['dependencies'];

    /* @ngInject */
    function Home() {
        var vm = this;

        activate();

        function activate() {
            console.log('home')
        }
    }
})();
