'use strict';

var Host, self,
    log = new (require('../util/logger'))(['all']),
    redis = require('redis');

/**
 * @class Host
 * @desc Listen for requests from clients
 * @inherits EventEmitter
 */
module.exports = Host = function (profile, id) {
    self = this;

    self.profile = profile;

    self.pub = redis.createClient(self.profile.port, self.profile.host);
    self.sub = redis.createClient(self.profile.port, self.profile.host);

    self.id = id || null;

    self.clients = {};

    self._listen();

    return self;
};

// Include EventEmitter for internal messaging
Host.prototype._events = new (require('events').EventEmitter)();

/**
 * @method when
 * @desc Get a callback when an event is recieved from a client
 */
Host.prototype.when = function (event, callback) {

    // awaiting response from event job
    self._events.on(event + '_req', function (req) {

        var _event = req.event,
            _args = req.args;

        return _event && _args && callback(_event, _args, function (resp) {
            self._events.emit(_event + '_resp', resp);
        });
    });
};

/**
 * @method _listen
 * @desc Listen for handshake requests
 * @private
 */
Host.prototype._listen = function () {

    self.sub.psubscribe('causeway:*');
    self.sub.on('psubscribe', function () {

        self.sub.on('pmessage', function (pattern, channel, message) {

            var split = channel.split(':'),
                key = split[1],
                method = split[2],
                type = split[3];

            if(method === 'handshake' && type === 'req') {

                log('general', 'Connecting to client with key: ' + message);

                // tell the client that it is connected
                self.pub.publish('causeway:' + message + ':handshake:resp', 'OK');

            } else if (method === 'message' && type === 'req') {

                // parse the response
                try {
                    message = JSON.parse(message);
                } catch (err) {}

                self._events.on(message.event + '_resp', function repond (response) {
                    self.pub.publish('causeway:' + key + ':message:resp', JSON.stringify({
                        event: message.event,
                        args: response
                    }));
                    self._events.removeListener(message.event + '_resp', repond);
                });

                self._events.emit(message.event + '_req', message);
            }
        });
    });
};
