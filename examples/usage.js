(function () {
    'use strict';

    /**
     * Functionality:
     * - Register to a redis pubsub bridge
     * - Send jobs and recieve results
     */
    var causeway = new require('causeway')();

    /**
     * @method register.proc
     * @desc register redis processing addresses
     */
    causeway.register({
        port: 1232,
        address: 0.0.0.0,
        auth: '62767sd8fs'
    });



    causeway.send('load_user', { some: 'args' }).then(function (result) {
        console.log('Result of job: ' + JSON.stringify(result, null, 4));
    });

})();
