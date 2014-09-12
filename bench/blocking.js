'use strict';

var causeway = (new (require('../index'))())
.register({
    'default': {
        port: 6379,
        host: '0.0.0.0'
    }
}),
    async = require('async');

// listen to all incoming
var api = causeway.listen('default');
api.when('load_user', function (job, args, done) {
    done({ status: 'success' });
});


var client = causeway.using('default');
client.on('handshake', function (key) {
    console.log('Handshook with client on key: ' + key);

    var count = 0,
        startTime = Date.now();

    async.whilst(function () {
        count ++;
        return count < 1000;
    }, function (done) {

        client.request('load_user', 'iyad').then(function (user) {
            done();
        });

    }, function () {
        console.log(require('chalk').green.inverse('Sync test took ' + (Date.now() - startTime) + 'ms'));
        return process.exit(0);
    });
});
