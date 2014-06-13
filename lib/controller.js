/**
 * @module controller
 * @desc Provides interface for adding, cancelling and scheduling jobs
 */

(function () {
    module.exports = function () {
        
        var Controller = function () {

        };

        // extend eventEmitter
        Controller.prototype = require('eventemitter');

        Controller.prototype.addJob = function (job) {

        };

        Controller.prototype.cancelJob = function (job) {

        };
    };
})();
