/**
 * Library sketch - using redis for communictaion
 * servers attached via redis
 */

'use strict';
var redis = require('redis');

/**
 * Server
 */
 var runAPI = function () {

    var handshake = redis.createClient(),
        clients = [];

    handshake.subscribe('causeway:handshake');
    handshake.on('subscribe', function () {
        handshake.on('message', function (channel, clientKey) {

            console.log('API: Handshake with key ' + clientKey);

            var sub = redis.createClient(),
                pub = redis.createClient();

            // tell the client that it is connected
            pub.publish(clientKey + '_handshake', 'OK');

            sub.subscribe(clientKey + '_req');
            sub.on('subscribe', function () {
                sub.on('message', function (channel, message) {

                    console.log('API: got message: '  + message);
                    pub.publish(clientKey + '_resp', 'result');
                });
            });

            // push to clients array for future use
            clients.push({
                sub: sub,
                pub: pub,
                key: clientKey
            });

        });
    });
};


/**
 * Client
 */
var runClient = function () {

    var sub = redis.createClient(),
        pub = redis.createClient(),
        requestToken = require('crypto').createHash('sha1').update((new Date()).valueOf().toString() + Math.random().toString()).digest('hex');

    pub.publish('causeway:handshake', requestToken);

    sub.psubscribe(requestToken + '_*');
    sub.on('psubscribe', function () {
        sub.on('pmessage', function (pattern, channel, resp) {

            if(channel === requestToken + '_handshake') {
                console.log('Client: handshake response: ' + resp);

                pub.publish(requestToken + '_req', 'hello!');
            } else {
                console.log('Client: got response: ' + resp);
            }
        });
    });
};



runAPI();
runClient();
