'use strict';

describe('Causeway lib', function () {

    var Causeway = require(process.cwd() + '/index.js')

    describe('Causeway::constructor', function () {

        var causeway = new Causeway();
        it('should create an instance of the causeway object', function () {
            causeway.should.be.an('object');
        });
    });
});
