'use strict';

var RedisHandler, self;

module.exports = RedisHandler = function (port) {
    self = this;
    
    self.spawn = require('child_process').spawn('redis-server', ['--port', port || '6379']);

    self.spawn.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    self.spawn.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
        self.kill(self.spawn.pid);
    });

    self.spawn.on('close', function (code) {
        console.log('child process exited with code ' + code);
    });

    // Kill spawn on node exit
    process.on('exit', function () {
        self._killProcess(self.spawn.pid);
    });
    process.on('SIGTERM', function () {
        self._killProcess(self.spawn.pid);
    });
};

// Inherit EventEmitter for events i/o
RedisHandler.prototype = new (require('events')).EventEmitter();

/**
 * @method kill
 * @desc Kill the spawn process
 */
RedisHandler.prototype.kill = function () {
    self._killProcess(self.spawn.pid);
};



/**
 * @method _killProcess
 * @private
 * @desc Kill the redis process
 */
RedisHandler.prototype._killProcess = function (pid, signal, callback) {

    signal = signal || 'SIGKILL';
    callback = callback || function () {};

    require('ps-tree')(pid, function (err, children) {
        [pid].concat(children.map(function (p) {
            return p.PID;
        })).forEach(function (tpid) {
            try {
                process.kill(tpid, signal)
            }
            catch (ex) { }
        });
        callback();
    });
};

//
// redis = require('child_process').spawn('redis-server', ['--port', '32432']);
//
// redis.stdout.on('data', function (data) {
//     console.log('stdout: ' + data);
//     redis.kill('SIGHUP');
// });
//
// redis.stderr.on('data', function (data) {
//     console.log('stderr: ' + data);
//     redis.kill('SIGHUP');
// });
//
// redis.on('close', function (code) {
//     console.log('child process exited with code ' + code);
// });
