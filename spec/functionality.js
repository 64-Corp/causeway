/**
 * Library sketch - using redis for communictaion
 * servers attached via redis
 */

'use strict';
var redis = require('redis'),
    port = 1672,
    host = '0.0.0.0';

/**
 * Server
 */
var runAPI = function () {

    var sub = redis.createClient(port, host),
        pub = redis.createClient(port, host);

    // format:
    // causeway:clientKey:handshake/message/destroy:req/resp
    sub.psubscribe('causeway:*');
    sub.on('psubscribe', function () {
        sub.on('pmessage', function (pattern, channel, message) {

            var split = channel.split(':'),
                key = split[1],
                method = split[2],
                type = split[3];

            if(method === 'handshake' && type === 'req') {

                console.log('API: Auth with key: ' + message);

                pub.publish('causeway:' + message + ':handshake:resp', 'OK');
            } else if ((method === 'message') && type === 'req') {
                pub.publish('causeway:' + key + ':message:resp', 'hello!!!');
            }
        });
   });
};


/**
 * Client
 */
var runClient = function () {

    var sub = redis.createClient(port, host),
        pub = redis.createClient(port, host),
        requestToken = require('crypto').createHash('sha1').update((new Date()).valueOf().toString() + Math.random().toString()).digest('hex');

    // client action #1: requestToken
    pub.publish('causeway:' + requestToken + ':handshake:req', requestToken);

    sub.psubscribe('causeway:' + requestToken + '*');
    sub.on('psubscribe', function () {
        sub.on('pmessage', function (pattern, channel, message) {

            var split = channel.split(':'),
                key = split[1],
                method = split[2],
                type = split[3];

            if(method === 'handshake' && type === 'resp') {
                console.log('Client: handshake response: ' + message);
                pub.publish('causeway:' + key + ':message:req', 'Hello?');

            } else if (method === 'message' && type === 'resp'){
                console.log('Client: got response: ' + message);
            }
        });
    });
};



runAPI();
runClient();
