(function () {
    'use strict';

    /**
     * Functionality:
     * - Register to a redis pubsub bridge
     * - Send jobs and recieve results
     */
    var causeway = new (require('../index.js'))();

    /**
     * @method register.proc
     * @desc register redis processing addresses
     */
    causeway.register({
        default: {
            "port": 6379,
            "addr": "127.0.0.1"
        }
    });
    
    // console.log(causeway._connections);
    // console.log(causeway._connections['default']);

    causeway.using('default').request('load_user', { some: 'args' }).then(function (result) {
        console.log('Result of job: ' + JSON.stringify(result, null, 4));
    });

})();
