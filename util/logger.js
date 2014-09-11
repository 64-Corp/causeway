'use strict';

var Logger, self,
    chalk = require('chalk');

module.exports = Logger = function (config) {

    self = this;
    self.config = config || ['all'];

    this.profiles = {
        general: {
            color: chalk.inverse
        },
        info: {
            color: chalk.reset
        },
        warning: {
            color: chalk.bold.black
        },
        data: {
            color: chalk.gray
        },
        error: {
            color: chalk.bgRed
        }
    };

    return function (profile, message) {
        return profile && message && self._shouldLog(profile) && process.stdout.write(self.profiles[profile].color(message) + '\n');
    };
};


Logger.prototype._shouldLog = function (profile) {
    var shouldLog = [];
    for(var key in self.config) {
        shouldLog[(profile === self.config[key] || self.config[key] === 'all') ? 'push' : 'valueOf'](profile || 'all');
    }
    return !!shouldLog.length;
};
