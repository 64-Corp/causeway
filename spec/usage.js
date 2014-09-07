'use strict';

var causeway = new (require('../index.js'))()
.register({
    'default': {
        port: 5678,
        host: '0.0.0.0'
    }
});

var bridge = causeway.using('default');
bridge.request('load_user', 'iyad').then(function (user) {
    console.log('user: ' + JSON.stringify(user, null, 4));
});
