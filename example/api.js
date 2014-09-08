'use strict';

var causeway = (new (require('../index'))())
    .register({
        'default': {
            port: 6379,
            host: '0.0.0.0'
        }
    }),
    bridge = causeway.using('default');


bridge.listen().then(function (channel, resp) {
    console.log('recieved message on channel ' + channel + ' :' + JSON.stringify(resp, null, 4));
});
