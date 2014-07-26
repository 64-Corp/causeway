(function () {
    'use strict';
    
    var causeway;
    beforeEach(function () {
        causeway = require('../index.js')({});
    });

    describe('Causeway', function (){

        it('should create an instance', function () {
            causeway.should.be.an('object');
        });

        it('should have inherited the client', function () {
            causeway.client.assign.should.be.a('function');
        });

        describe('Binding express', function () {

            var app = require('./server.js');

            app.listen(3004, function () {
                causeway.client.assign(app.post);

                it('should assign app.post to the client', function () {

                });
            });
        });
    });
})();
