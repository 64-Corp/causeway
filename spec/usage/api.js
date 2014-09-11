'use strict';

var causeway = (new (require('../../index'))())
    .register({
        'default': {
            port: 6379,
            host: '0.0.0.0'
        }
    });

// listen to all incoming
var host = causeway.listen('default');

// listen to a specific connection
// var specificHost = causeway.listen('default', 'shufa78ds6f78sa7f789asdfv6s9df67sd89gf6sd7fa');

host.when('load_user', function (job, args, done) {

    console.log('job: ' + JSON.stringify(job) + ' with args: ' + JSON.stringify(args, null, 4));

    done({ status: 'success' });
});
