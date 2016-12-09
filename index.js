var config = require('./config');

module.exports.Client = require('./client');
module.exports.Server = require('./server');
module.exports.config = function(options) {
    config = options;
};