'use strict';

var Bridge,
    q = require('q'),
    self;

/**
 * @class Bridge
 * @desc Selects redis pub/sub address and
 *       interfaces with remote server
 */
module.exports = Bridge = function (profileConnection) {

    this.connection = profileConnection;

    self = this;
};

/**
 * @method request
 * @desc Send an event and message, recieve the respose
 * @returns {Promise} Success holds the returned response
 */
Bridge.prototype.request = function (event, args) {

    var conn = self.connection,
        name = Object.keys(conn)[0],
        message = JSON.stringify({
            event: event,
            args: args
        }),
        d = q.defer();

    conn.pub.publish(name, message);
    conn.sub.subscribe(name);
    conn.sub.on('message', function (channel, resp) {

        try {
            resp = JSON.parse(resp);
            d.resolve(resp);
        } catch (err) {
            d.reject(resp);
        }
        
        conn.sub.unsubscribe(name);
    });

    return d.promise;
};
