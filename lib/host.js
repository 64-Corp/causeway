'use strict';

var Host, self,
    log = new (require(process.cwd() + '/util/logger'))([]),
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

    self.clients = [];

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

    self.handshake.subscribe('causeway:handshake');
    self.handshake.on('subscribe', function () {

        self.handshake.on('message', function (channel, clientKey) {

            log('general', 'Connecting to client with key: ' + clientKey);

            var sub = redis.createClient(self.profile.port, self.profile.host),
                pub = redis.createClient(self.profile.port, self.profile.host);

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

            // push to clients array for future use
            self.clients.push({
                sub: sub,
                pub: pub,
                key: clientKey
            });

            sub.on('disconnect', function () {
                sub.quit();
            });

            pub.on('disconnect', function () {
                sub.quit();
            });
        });
    });
};
