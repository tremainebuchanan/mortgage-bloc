(function() {
    'use strict';

    angular
        .module('mb')
        .controller('Purchase', Purchase);

    Purchase.$inject = ['$http'];

    /* @ngInject */
    function Purchase($http) {
        var vm = this;
        vm.purchase = purchase
        var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var ID_LENGTH = 8;
        activate();

        function activate() {
          $http.get('http://e03542f3.ngrok.io/api/Person').then(function(res){
            vm.list = res.data
          })
        }

        function purchase(listing) {
          var sale = {
            "$class": "org.acme.mortgagebloc.SalesAgreement",
            "salesAgreementId": generate(),
            "conditions": "5% downpayment",
            "cost": 1400000,
            "buyer": "string",
            "seller": listing.trn,
            "status": "SIGNED"
          }

          $http.post('http://e03542f3.ngrok.io/api/SalesAgreement', sale, function(res){
            console.log(res)
          })
        }

        function generate() {
          var rtn = '';
          for (var i = 0; i < ID_LENGTH; i++) {
            rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
          }
          return rtn;
        }
    }
})();
