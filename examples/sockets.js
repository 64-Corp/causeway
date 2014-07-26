// requiring returns new causeway instance
var causeway = require('../index.js')()

// regitser a remote processor
.register('processor', function (registrar) {

    net.connect('0.0.0.0:3014', function (connectObj) {
        // define and establish connection to job processor
        register.save('ruby', connectObj);
    });
});

// bind the input of socket event emitter for binding to .when
causeway.client.assign('input', socket.on);
causeway.client.assign('input', app.post('/request'));

// returns to the client using randomized ids
causeway.client.assign('return', socket.emit);

// pass task to a processor (perhaps with a different name)
causeway.when('load_user', causeway.pass('ruby', 'loadUser'));

// switch on requests for local jobs
causeway.when('requestUserCount', function (job) {

    // process the job locally

    // return the value
    job.done(0);
})

// log errors
.error(function (err) {

})

// gone through the entire .when series
.done(function () {

});
