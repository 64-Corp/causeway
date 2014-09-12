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

    self.connection.pub.publish('causeway:' + self.token + ':handshake:req', self.token);
    self.connection.sub.psubscribe('causeway:' + self.token + '*');
    self.connection.sub.on('psubscribe', function () {

        self.connection.sub.on('pmessage', function (pattern, channel, message) {

            var split = channel.split(':'),
                key = split[1],
                method = split[2],
                type = split[3];

            if(method === 'handshake' && type === 'resp') {
                self.emit('handshake', key);
            } else if (method === 'message' && type === 'resp'){

                try {
                    message = JSON.parse(message);
                } catch (err) {}

                self.emit(self.token + '_resp_' + message.event, message.args);
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

    conn.pub.publish('causeway:' + self.token + ':message:req', message);

    self.on(self.token + '_resp_' + event, function respond (resp) {
        d.resolve(resp);
        return self.removeListener(self.token + '_resp_' + event, respond);
    });

    return d.promise;
};
