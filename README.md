## Usage
```
$ npm install jemitter
```
```js
var jemitter = require('jemitter');
jemitter.config({
    'host': redis host,          //default is 127.0.0.1
    'port': redis port          //default is 6379
});
var server = new jemitter.Server({
    'host': host tcp address,
    'port': port,
    'handlers': {
        'foobar': function(data, cb) {...}
        ...
    }
});

var client = new jemitter.Client({
    'host': server host address,
    'port': server host port
});

client.emit('foobar', {'foo': 'bar'})
    .then(function(res) ...)
    .catch(function(err) ...);
```

## About
Jemitter is simple event emitter between servers, which works with tcp connections, and redis pub/sub.

## Features
1. Fast
2. Promisified
3. Singletone

