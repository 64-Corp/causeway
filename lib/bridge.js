'use strict';

var Bridge,
    q = require('q'),
    log = new (require('../util/logger'))([]),
    redis = require('redis'),
    self;

/**
 * @class Bridge
 * @desc Selects redis pub/sub address and
 *       interfaces with remote server
 */
module.exports = Bridge = function (profile) {

    self = this;

    self.connection = {
        sub: redis.createClient(profile.port, profile.host),
        pub: redis.createClient(profile.port, profile.host)
    };

    log('general', 'Connecting to redis server with details: ' + JSON.stringify(profile));

    self.token = require('crypto').createHash('sha1').update((new Date()).valueOf().toString() + Math.random().toString()).digest('hex');

    self.connection.pub.publish('causeway:handshake', self.token);
    self.connection.sub.psubscribe(self.token + '_*');
    self.connection.sub.on('psubscribe', function () {

        var handCount = 0;

        self.connection.sub.on('pmessage', function (pattern, channel, resp) {

            if(channel === self.token + '_handshake') {

            // this will always emit twice per one time
            return (handCount % 2) === 0 ? self.emit('handshake', self.token) && handCount++ : handCount++;

            } else if(channel === self.token + '_resp') {

                try {
                    resp = JSON.parse(resp);
                } catch (err) {}

                self.emit(self.token + '_resp_' + resp.event, resp.args);
            }
        });
    });
};

// inherit from EventEmitter
Bridge.prototype = new (require('events').EventEmitter)();

/**
 * @method request
 * @desc Send an event and message, recieve the respose
 * @returns {Promise} Success holds the returned response
 */
Bridge.prototype.request = function (event, args) {

    var conn = self.connection,
        message = JSON.stringify({
            event: event,
            args: args
        }),
        d = q.defer();

    conn.pub.publish(self.token + '_req', message);

    self.on(self.token + '_resp_' + event, function (resp) {
        d.resolve(resp);
    });

    return d.promise;
};
