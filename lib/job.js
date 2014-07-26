/**
 * @module Job
 * @desc Defines the job object which holds all details for the job
 */

exports.module = (function (options) {
    'use strict';

    var Job = function (_args) {
        this.args = _args;
    };

    return new Job(options);
})();
