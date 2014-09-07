/**
 * @author Iyad Assaf <iyadassaflondon@gmail.com>
 * @module causeway
 * @desc Defines the body and interface for the router
 */

/**
 * Causeway is a job router that can spread jobs across platforms
 * It allows easy routing of jobs from sockets, HTTP or test enviroments
 * Uses promises for easy chaining
 * If used with sockets, HTTP like responses are generated
 */

'use strict';

var Causeway,
    redis = require('redis'),
    self;

/**
 * @class Causeway
 * @constructor
 */
module.exports = Causeway = function (cfg) {
    self = this;
    self._connections = {};

    // default
    self.default = (cfg && cfg.default) || {
        port: 6379,
        host: '0.0.0.0'
    };
};

/**
 * @method register
 * @param {Object, Optional} JSON containing string keys for addr, port and auth
 * @desc register pub and sub redis channels and authorize
 * @returns {Promise} Success holds Causeway._connections
 */
Causeway.prototype.register = function (config) {

    return typeof(config) === 'object'

    ?

    // if there is a config passed, loop through profiles and setup redis clients
    Object.keys(config).forEach(function (profileName) {
        var current = config[profileName],
            connection = {
                pub: redis.createClient(current.port, current.host),
                sub: redis.createClient(current.port, current.host)
            };

        // if auth is provided, authenticate, otherwise push the connection to the connection list
        self._connections[profileName] = (current.auth ? (connection.pub.auth(current.auth) && connection.sub.auth(current.auth) && connection) : connection);
    }) && self._connections

    :

    self._connections['default'] = {
        pub: redis.createClient(self.default.port, self.default.host),
        sub: redis.createClient(self.default.port, self.default.host)
    } && self._connections;
};

/**
 * @method using
 * @param {String} The name of the connection profile to use
 * @desc Select which connection is to be uses
 * @returns A Bridge() object which has an interfacing for communicating
 *          with the selected remote server
 * @example This can be used to chain directly onto the Bridge::request method
 *          causeway.using('coffee_barista').request('more coffee', { take: { my: 'money' } });
 */
Causeway.prototype.using = function (profileName) {
    return new (require('./bridge.js'))(self._connections[profileName]);
};

/**
 * @method request
 * @desc request information from the `default` remote sever
 */
Causeway.prototype.request = function (event, args) {
    // initialize the Bridge object with the default connection
    var _bridge = new (require('./bridge.js'))(self._connections['default']);
    return _bridge.request(event, args);
};
