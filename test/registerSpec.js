'use strict';

var Causeway = require(process.cwd() + '/index.js'),
    causeway = new Causeway();

describe('Transport',function () {

    it('should use send simple job between two clients and back', function (completed) {

        // api
        causeway.listen('default')
        .when('load', function (job, args, done) {
            done('some response');
        });

        // client
        causeway.using('default')
        .request('load', 'some args').then(function () {
            completed();
        });
    });
});
