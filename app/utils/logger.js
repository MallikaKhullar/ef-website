'use strict';

var log4js = require('log4js');

function SimpleLogger(prefix) {
    this.prefix = prefix;
    this.logger = log4js.getLogger('app');

}
SimpleLogger.prototype.logMessage = function(level, args) {
    var message = [' (', this.prefix, ') '],
        i, n;
    for (i = 0, n = args.length; i < n; i++) {
        message.push(args[i]);
    }
    this.logger[level].apply(this.logger, message);
};

SimpleLogger.prototype.fatal = function() {
    this.logMessage('fatal', arguments);
};

SimpleLogger.prototype.error = function() {
    this.logMessage('error', arguments);
};

SimpleLogger.prototype.debug = function() {
    this.logMessage('debug', arguments);
};

SimpleLogger.prototype.info = function() {
    this.logMessage('info', arguments);
};

var defaultLogger = new SimpleLogger('Log');

/**
 * Return the default logger
 *
 * @returns {SimpleLogger}
 */
exports.getDefaultLogger = function() {
    return defaultLogger;
};

/**
 * Get a logger with a particular name
 * @param prefix
 * @returns {SimpleLogger}
 */
exports.getLoggerFor = function(prefix) {
    return new SimpleLogger(prefix);
};