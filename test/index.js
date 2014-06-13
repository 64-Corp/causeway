(function () {

    'use strict';

    var should = require("chai").should();
    describe('Causeway', function (){
        
        var options = {

        };

        var causeway = require('../index.js')();
        it('should create an instance', function () {
            causeway.should.be.an('object');
        });
    });

})();
