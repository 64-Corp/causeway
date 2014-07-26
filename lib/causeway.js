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
(function () {
    'use strict';

    module.exports = function (options) {

        /**
         * @class Causeway
         */
        var Causeway = function () {
            this.debug = options && options.debug || 1;
        };
        
        // extend the controller
        // Causeway.prototype = require('./controller.js');
        Causeway.prototype.client = require('./client/client.js');

        // include the client
        // util.inherits(Causeway.prototype, require('./client/client'));

        return new Causeway(options);
    };
})();
