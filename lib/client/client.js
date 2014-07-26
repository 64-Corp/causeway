module.exports = (function () {
    'use strict';

    var Client = function () {
        this.listeners = [];
    };

    Client.prototype.assign = function (type, receptor) {

        // var bind = new Bind(type);
        if(receptor.constructor === Function) {

        }
    };

    return new Client();
})();
