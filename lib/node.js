/**
 * @module Node
 * @desc Responsible for creating, destroying and connecting router nodes
 */
(function () {

    'use strict';
    
    /**
     * @class Creator
     * @desc Create a local router node
     */
    exports.Creator = function (creationOptions) {

        var Creator = function (options) {

        };

        return new Creator(creationOptions);
    };

    /**
     * @class Connector
     * @desc Connect to local or remote router node
     */
    exports.Connector = function (connectionOptions) {

        var Connector = function (options) {

        };


        return new Connector(connectionOptions);
    };
})();
