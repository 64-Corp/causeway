'use strict';

var causeway = (new (require('../../index'))())
    .register({
        'default': {
            port: 6379,
            host: '0.0.0.0'
        }
    }),
    bridge = causeway.using('default');

bridge.on('handshake', function (key) {
    console.log('Handshook with client on key: ' + key);

    bridge.request('load_user', 'iyad').then(function (user) {
        console.log('load_user returned: ' + JSON.stringify(user, null, 4));
    });

    bridge.request('load_user', 'ulpian').then(function (user) {
        console.log('load_user returned: ' + JSON.stringify(user, null, 4));
    });
});
