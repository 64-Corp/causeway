/**
 * @author Iyad Assaf <iyadassaflondon@gmail.com>
 * @module causeway
 * @desc Defines the body and interface for the router
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
        Causeway.prototype = require('./controller.js');
        
        /**
         * @method Connect to a local or remote route node
         */
        Causeway.prototype.connect = function (connectionOptions) {
            var nodeConnector = require('./node.js').Connector(connectionOptions);
        };

        return new Causeway(options);
    };

})();
