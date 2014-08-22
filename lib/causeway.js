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
/**
 * @class Causeway
 */
var Causeway = function (options) {
    this.debug = options && options.debug || 1;
    this._connections = [];
    
    self = this;
},
    self;

/**
 * @method register
 * @desc register pub and sub redis channels and authorize
 * @returns {Promise} Success holds Causeway._connections
 */
Causeway.prototype.register = function (config) {
    var redis = require('redis'),
        d = require('q').defer(),
        profileCount = 0;

    Object.keys(config).forEach(function (profileName) {
        var authCount = 0,
            current = config[profileName],
            connection = {
                pub: redis.createClient(current.port, current.host),
                sub: redis.createClient(current.port, current.host)
            };

        Object.keys(current).forEach(function (client) {

            client.auth(config.auth, function () {
                d.resolve((authCount === Object.keys(config[profileName]).length) && self._connections.push(connection) && self._connections);
                authCount++;
            });
        });

        d.resolve((profileCount === Object.keys(config).length) && self._connections);
        profileCount++;
    });

    return d.promise;
};


module.exports = Causeway;
