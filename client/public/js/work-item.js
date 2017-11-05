(function() {
    'use strict';

    angular
        .module('mb')
        .controller('WorkItem', WorkItem);

    //WorkItem.$inject = ['dependencies'];

    /* @ngInject */
    function WorkItem() {
        var vm = this;

        activate();

        function activate() {
            console.log('work item')
        }
    }
})();
