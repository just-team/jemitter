const net = require('net');
const crypto = require('crypto');
const NRP    = require('node-redis-pubsub');

var config = require('../config');
var nrp = new NRP(Object.assign({scope : 'jemitter'}, config));

nrp.on("error", function(err){
	throw err;
});

function Server(options) {
	var _this = this;

	_this.host = options.host;
	_this.port = options.port;
	_this.handlers = options.handlers;
	_this.token = crypto.randomBytes(20).toString('hex');

	nrp.on(_this.token, function(req){
		function resolve(err, data) {
			data.error = err;
			nrp.emit(req.token, data);
		}
		_this.handlers[req.event](req.data, resolve);
	});

	var server = net.createServer(function(socket) {
		socket.write(JSON.stringify({
			event: 'pubsub',
			token: _this.token
		}));
	});

	server.on('error', function(err) {
		console.log('net error: ', err);
	});

	server.listen({host: _this.host, port: _this.port}, function() {
		console.log('opened client on', server.address());
	});
};

module.exports = Server;