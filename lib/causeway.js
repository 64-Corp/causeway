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
 * @desc register redis connections
 */
Causeway.prototype.register = function (config) {
    self.registered = config;
    return self;
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
    return new (require('./bridge'))(self.registered[profileName]);
};

/**
 * @method request
 * @desc request information from the `default` remote sever
 */
Causeway.prototype.request = function (event, args) {
    // initialize the Bridge object with the default connection
    var _bridge = new (require('./bridge'))(self.registered['default']);
    return _bridge.request(event, args);
};


/**
 * @method listen
 * @params profile  {String} Name of the redis profile to use
 *         id       {String} Specifc client id to communicate with
 */
Causeway.prototype.listen = function (profile, id) {
    return new (require('./host'))(self.registered[profile], id);
};
