/*global exports: true, require: true */

(function() {
    'use strict';
    var logger = require('./logger.js').getLoggerFor('deferred');

    function objKeys(obj) {
        var k, keys = [];
        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    }

    var defaultMonitor = {
        unhandledException: function(ex) {
            logger.error('Deferred callback raised an exception: ', ex.message);
            // logger.debug(ex.stack);
            logger.fatal("" + ex.stack);


        },
        expectationFailed: function(msg) {
            logger.error('Expectation failed: ', msg.message);
        }
    };

    function executeListeners(self, listeners, result) {
        listeners.forEach(function(f) {
            try {
                f(result);
            } catch (ex) {
                self.monitor.unhandledException(ex);
            }
        });
    }

    /**
     * A failure that occurs when an exception is thrown
     *
     * @param ex The exception
     * @constructor
     */
    function ExceptionFailure(ex) {
        this.ex = ex;
    }

    /**
     * Common methods shared by all deferred types.
     * @constructor
     */
    function DeferredPrototype() {}

    /**
     * Construct a new defered out of the result.
     *
     * @param next A function to use to construct a new defered
     */
    DeferredPrototype.prototype.pipe = function(next) {
        return new SequencedDeferred(this, next, this.monitor);
    };

    /**
     * Construct a new defered of the result of failing
     *
     * @param next A function used to construct the new deferred
     */
    DeferredPrototype.prototype.pipeFailure = function(next) {
        return new FailureSequencedDeferred(this, next, this.monitor);
    };

    /**
     * Execute callbacks when the deferred is done processing
     *
     * @param callbacks The success and failure callbacks
     */
    DeferredPrototype.prototype.then = function(callbacks) {
        try {
            if (!this.finished) {
                this.successListeners.push(callbacks.success.bind(callbacks));
                this.failureListeners.push(callbacks.failure.bind(callbacks));
            } else {
                if (this.successfull === true) {
                    callbacks.success(this.result);
                } else {
                    callbacks.failure(this.error);
                }
            }
        } catch (ex) {
            this.monitor.unhandledException(ex);
        }
    };

    /**
     * Execute callback if deffered is successfull
     *
     * The callback will accept one parameter which
     * is the result object
     *
     * @param callback The function to call
     */
    DeferredPrototype.prototype.success = function(callback) {
        this.then({
            success: callback,
            failure: function() {}
        });
        return this;
    };

    /**
     * Execute callback if the deferred fails
     *
     * The callback will accept one parameter which is hte
     * error object
     *
     * @param callback The function to call
     */
    DeferredPrototype.prototype.failure = function(callback) {
        this.then({
            success: function() {},
            failure: callback
        });
        return this;
    };

    DeferredPrototype.prototype._handleSuccess = function(result) {
        this.result = result;
        this.successfull = true;
        executeListeners(this, this.successListeners, result);
        this.finished = true;
    };

    DeferredPrototype.prototype._handleFailure = function(error) {
        this.error = error;
        executeListeners(this, this.failureListeners, error);
        this.successfull = false;
        this.finished = true;

    };

    /**
     * A deferred is a delayed computation
     * This can be used to chain asynchronous operations
     *
     * The callback structure
     *
     *  {
     *      success: function(result) { ... }
     *      failure: function(error) { ... }
     *  }
     *
     * @param using A function that will accept an object with two callbacks
     * @param monitor Object used to watch failure conditions inside the deferred
     *
     */
    function Deferred(using, monitor) {
        this.monitor = monitor;
        this.finished = false;
        this.successListeners = [];
        this.failureListeners = [];
        var self = this;

        function onSuccess(result) {
            if (self.finished === false) {
                self._handleSuccess(result);
            } else {
                self.monitor.expectationFailed('A deferred can be executed only once');
            }
        }

        function onFailure(error) {
            if (self.finished === false) {
                self._handleFailure(error);
            } else {
                self.monitor.expectationFailed('A deferred can be executed only once');
            }
        }

        try {
            using({ success: onSuccess, failure: onFailure });
        } catch (ex) {
            onFailure(new ExceptionFailure(ex));
        }
    }
    Deferred.prototype = new DeferredPrototype();


    /**
     * A sequenced defered executes the first defered
     * And then passed on the result of the first deferd to next
     * which returns a deferred that it waits on.
     */
    function SequencedDeferred(first, then, monitor) {
        this.monitor = monitor;
        this.successListeners = [];
        this.failureListeners = [];
        var self = this;
        first.then({
            success: function(result) {
                var second = then(result);
                second.then({
                    success: function(result) {
                        self._handleSuccess(result);
                    },
                    failure: function(error) {
                        self._handleFailure(error);
                    }
                });
            },
            failure: function(error) {
                self._handleFailure(error);
            }
        });
    }

    SequencedDeferred.prototype = new DeferredPrototype();

    /**
     * A combined deferred create combines the results of multiple
     * deferreds into a single deferred.
     * The result is in the form of an object with unique names for the result of
     * each deferred
     *
     * @param parts An object where the key is the name to use for the
     *        result and the value is a deferred.
     * @param monitor An object used to log errors in the deferred
     */
    function CombinedDeferred(parts, monitor) {
        var self = this,
            partNames = objKeys(parts),
            failure = false,
            errors = [],
            results = {},
            partCount = partNames.length,
            finishCount = 0;

        this.monitor = monitor;
        this.successListeners = [];
        this.failureListeners = [];


        function onSuccess() {
            self._handleSuccess(results);
        }

        function onFailure() {
            self._handleFailure(errors);
        }

        partNames.forEach(function(name) {
            var part = parts[name];
            parts[name] = part;
            part.then({
                success: function(r) {
                    finishCount += 1;
                    results[name] = r;
                    if (finishCount === partCount) {
                        if (!failure) {
                            onSuccess();
                        } else {
                            onFailure();
                        }
                    }
                },
                failure: function(error) {
                    finishCount += 1;
                    failure = true;
                    errors.push(error);
                    if (finishCount === partCount) {
                        onFailure();
                    }
                }
            });
        });
    }

    CombinedDeferred.prototype = new DeferredPrototype();



    /**
     * A failure sequenced defered is similar to a sequenced deferred
     * except that it executes if the first deferred fails and returns
     * And then passed on the result of the first deferrd to next
     * which returns a deferred that it waits on.
     * If the first defered succeeds it's result is returned as a result
     */
    function FailureSequencedDeferred(first, then, monitor) {
        this.monitor = monitor;
        this.successListeners = [];
        this.failureListeners = [];
        var self = this;
        first.then({
            success: function(result) {
                self._handleSuccess(result);
            },
            failure: function(error) {
                var second = then(error);
                second.then({
                    success: function(result) {
                        self._handleSuccess(result);
                    },
                    failure: function(error) {
                        self._handleFailure(error);
                    }
                });
            }
        });
    }

    FailureSequencedDeferred.prototype = new DeferredPrototype();

    /**
     * Create a new deferred
     */
    function defer(using) {
        return new Deferred(using, defaultMonitor);
    }

    /**
     * Combine the results of deferred
     */
    function combine(parts) {
        return new CombinedDeferred(parts, defaultMonitor);
    }


    /**
     * Create a defer which will always succeed
     */
    function success(result) {
        return new Deferred(function(callbacks) {
            callbacks.success(result);
        }, defaultMonitor);
    }

    /**
     * Create a defer which will always fail
     */
    function failure(error) {
        return new Deferred(function(callbacks) {
            callbacks.failure(error);
        }, defaultMonitor);
    }

    /**
     * A deferred that executes only after something has bound to
     * it.
     */
    function lazy(fn) {
        return new Deferred(function(callbacks) {
            callbacks.success(fn());
        }, defaultMonitor);
    }

    function delay(time, message) {
        return new Deferred(function(callbacks) {
            setTimeout(function() {
                callbacks.success(message);
            }, time);
        }, defaultMonitor);
    }

    /**
     * Wrap the return value of a function in a deferred
     *
     *
     */
    function lift(f, ctx) {
        return function() {
            var args = arguments;
            return lazy(function() { return f.apply(ctx, args); });
        };
    }

    /**
     * Set the default monitor to something else
     *
     * @param monitor
     */
    function setDefaultMonitor(monitor) {
        defaultMonitor = monitor;
    }


    /**
     * Fetch the default monitor to something else
     *
     * @param monitor
     */
    function getDefaultMonitor() {
        return defaultMonitor;
    }

    exports.defer = defer;
    exports.combine = combine;
    exports.success = success;
    exports.failure = failure;
    exports.delay = delay;
    exports.lazy = lazy;
    exports.lift = lift;
    exports.setDefaultMonitor = setDefaultMonitor;
    exports.getDefaultMonitor = getDefaultMonitor;
}());