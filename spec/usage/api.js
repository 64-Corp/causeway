'use strict';

var causeway = (new (require('../index'))())
    .register({
        'default': {
            port: 6379,
            host: '0.0.0.0'
        }
    });

// listen to all incoming
var host = causeway.listen();

// listen to a specific connection
var specificHost = causeway.listen('shufa78ds6f78sa7f789asdfv6s9df67sd89gf6sd7fa');

host.on('*_user', function (job, data, done) {
    console.log('job: ' + job + ' with args: ' + JSON.stringify(args, null, 4));
    
    done({ status: 'success' });
});
