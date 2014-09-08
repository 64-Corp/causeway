'use strict';

var causeway = (new (require('../index'))())
    .register({
        'default': {
            port: 6379,
            host: '0.0.0.0'
        }
    }),
    bridge = causeway.using('default');

bridge.request('load_user', 'iyad').then(function (user) {
    console.log('user: ' + JSON.stringify(user, null, 4));
});
