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

    var arr = [];

    for(var i = 0; i<1000; i++) {
        arr.push(i);
    }

    var startTime = Date.now();

    async.map(arr, function (count, done) {

        client.request('load_user', 'iyad').then(function (user) {
            done(null, user);
        });

    }, function () {
        console.log(require('chalk').green.inverse('Aync test took ' + (Date.now() - startTime) + 'ms'));
        return process.exit(0);
    });
});
