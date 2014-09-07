'use strict';

describe('Register',function () {

    var Causeway = require(process.cwd() + '/index.js'),
        RedisHandler = require('./resources/redisHandler'),
        causeway,
        redis;

    before(function () {
        redis = new RedisHandler(1235);
    });

    afterEach(function () {
        redis.kill();
    });

    beforeEach(function () {
        causeway = new Causeway();
    });

    it('should use the default redis host and port if no options are passed to register', function () {
        // causeway.register();
    });
});
