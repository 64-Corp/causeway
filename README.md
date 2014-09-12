causeway
=====

[![wercker status](https://app.wercker.com/status/0d7d2adc026498b195f564f23864616a/s "wercker status")](https://app.wercker.com/project/bykey/0d7d2adc026498b195f564f23864616a)

Link individual or groups applications together via Redis to create modular full stack node systems.

### API

```javascript
    var causeway = (new (require('causeway'))())
    // register redis profiles
    .register({
        'default': {
            port: 6379,
            host: '0.0.0.0'
        },
        'special': {
            port: 5678,
            host:'0.0.0.0'
        }
    });

    /**
     * Host
     */

    // listen on a redis connection
    causeway.listen('default')

    // switch on job events
    .when('load_user', function (job, args, done) {
        console.log('Process job: ' + job + ', with args: ' + JSON.stringify(args, null, 4));

        // call callback on completion with reponse
        done({ status: 'success' });
    });

    /**
     * Client
     */

    // Connect to host via redis profile
    var client = causeway.using('default');

    // On handshake completion
    client.on('handshake', function (key) {
        console.log('Handshake with client with key: ' + key);

        // request job from host
        client.request('load_user', 'iyad', function (response) {

            // callback on job completion
            console.log('Response for load_user job: '+ JSON.stringify(response));
        });
    });

```


###Tests

`npm install && npm test`

### Benchmarks

`npm run bench`
