'use strict';

var Host, self,
    log = new (require('../util/logger'))([]),
    redis = require('redis');

/**
 * @class Host
 * @desc Listen for requests from clients
 * @inherits EventEmitter
 */
module.exports = Host = function (profile, id) {
    self = this;

    self.profile = profile;
    self.handshake = redis.createClient(self.profile.port, self.profile.host);
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

    self.handshake.psubscribe('causeway:*');
    self.handshake.on('psubscribe', function () {

        self.handshake.on('pmessage', function (pattern, channel, clientKey) {

            var method = channel.split(':')[1],
                key = channel.split(':')[2],
                sub, pub;

            if(method === 'handshake') {

                log('general', 'Connecting to client with key: ' + clientKey);

                sub = redis.createClient(self.profile.port, self.profile.host);
                pub = redis.createClient(self.profile.port, self.profile.host);

                self.clients[clientKey] = {
                    sub: sub,
                    pub: pub
                };

                // tell the client that it is connected
                pub.publish(clientKey + '_handshake', 'OK');

                sub.subscribe(clientKey + '_req');
                sub.on('subscribe', function () {
                    sub.on('message', function (channel, req) {

                        // parse the response
                        try {
                            req = JSON.parse(req);
                        } catch (err) {}

                        self._events.on(req.event + '_resp', function (response) {
                            pub.publish(clientKey + '_resp', JSON.stringify({
                                event: req.event,
                                args: response
                            }));
                        });

                        self._events.emit(req.event + '_req', req);
                    });
                });

            } else if ((method === 'destroy') && key) {

                console.log('Deleting redis clients with key: ' + key);

                for(var type in self.clients) {
                    return self.clients[key][type] ? self.clients[key][type].end() && (delete self.clients[key]): null;
                }
            }
        });
    });
};
