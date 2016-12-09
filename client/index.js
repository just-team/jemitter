const net = require('net');
const crypto = require('crypto');
const Promise = require('bluebird');
const NRP = require('node-redis-pubsub');

Promise.config({
    cancellation: true
});

var config = require('../config');
var nrp = new NRP(Object.assign({scope : 'jemitter'}, config));

nrp.on("error", function(err){
	throw err;
});

function Client(options) {
	var _this = this;

	_this.host = options.host;
	_this.port = options.port;
};

Client.prototype.emit = function(_event, _data) {
	var _this = this;
	var promise = new Promise(function(resolve, reject) {
		try {
			var client = new net.Socket();
			client.connect({port: _this.port, host: _this.host}, function() {
				console.log('Connected');
			});

			client.on('data', function(data) {			
				data = JSON.parse(data);
				if (data.event = 'pubsub') {
					var _redisToken = crypto.randomBytes(20).toString('hex');
					var unsubscribe = nrp.on(_redisToken, function(data){
						if(data.error) {
							reject(data.error);
						} else {
							resolve(data);
						}
						unsubscribe();
						client.end();
					});
					nrp.emit(data.token, {
						event: _event,
						data: _data,
						token: _redisToken
					});			
				}
			});

			client.on('close', function() {
				console.log('Connection closed');
			});	

			client.on('error', (err) => {
				reject(err);
			});
		} catch (e) {
			reject(e);
		}	
	});
	return promise;
};

module.exports = Client;