/*jshint globalstrict: true*/
/*global require: true, exports: true */
'use strict';

var deferred = require('./deferred.js'),
    moment = require('moment');


/**
 * This is a collection of useful functions
 */
/**
 * Format a date object for display
 *
 * @param date {Date} The date object to format
 * @return {string} The formated date string
 */
function formatDate(date) {
    return moment(date).format('MMM DD, YYYY');
}

/**
 * Format the time part of a date object for display
 * @param date {Date} The date object to format
 * @return {string} The formated time string
 */
function formatTime(date) {
    return moment(date).format('hh:mm A');
}

/**
 * Format a value as rupees
 *
 * Uses math.round to round off the number
 *
 * @param amount The ammount to format
 * @return {string} The string version of the amount
 */
function formatCurrency(amount) {
    var rounded = Math.round(amount * 100).toString(),
        length = rounded.length,
        rs = rounded.slice(0, length - 2),
        ps = rounded.slice(length - 2);
    return rs + '.' + ps;
}

/**
 * This function returns whatever is passed to it
 *
 * @apram obj The parameter
 * @return obj itself
 */
function id(obj) { return obj; }

/**
 * Generate a lookup table from an array
 *
 * @param items {Array} The array of items
 * @param keyFunc {Function} The function to construct a key for the table
 * @param valFunc {Function} The function to construct a value for the table
 * @return {Object}
 */
function makeTable(items, keyFunc, valFunc) {
    var table = {};
    items.forEach(function(item) {
        table[keyFunc(item)] = valFunc(item);
    });
    return table;
}

/**
 * Generate a table of arrays from an array
 * This similar to makeTable except that values with the same key
 * will be put into the same array.
 *
 * @param list {Array} The array of items
 * @param keyFunc {Function} The function to construct a key for the table
 * @param mapFunc {Function} The function to construct a value for the table
 * @return {Object}
 */
function makeArraysTable(list, keyFunc, mapFunc) {
    if (mapFunc === undefined) {
        mapFunc = id;
    }
    var d = {};
    list.forEach(function(e) {
        var k = keyFunc(e);
        if (d[k] === undefined) {
            d[k] = [];
        }
        d[k].push(mapFunc(e));
    });
    return d;
}

/**
 * Build a function that returns the value of a particular field
 * in an object
 *
 * @param colName The name a field to look up.
 * @return {Function}
 */
function col(colName) {
    return function(obj) {
        return obj[colName];
    };
}



/**
 * Remove duplicate strings from an array
 *
 * @param array {Array}  An array of strings
 * @return An array of the same strings without duplicates
 */
function uniqueStrings(array) {
    var o = {},
        na = [],
        i, n, s;
    for (i = 0, n = array.length; i < n; i++) {
        s = array[i];
        if (o[s] === undefined) {
            na.push(s);
            o[s] = true;
        }
    }
    return na;
}

/**
 * Get extract the keys of an object as an array
 *
 * @param obj {Object} An object
 * @return {Array} An array of string
 */
function objKeys(obj) {
    var k, keys = [];
    for (k in obj) {
        if (obj.hasOwnProperty(k)) {
            keys.push(k);
        }
    }
    return keys;
}

function objItems(obj) {
    var keys = objKeys(obj);
    return keys.map(function(key) {
        return { key: key, value: obj[key] };
    });
}

function obj(items) {
    var o = {};
    items.forEach(function(item) {
        o[item.key] = item.value;
    });
    return o;
}

/**
 * Do a shallow copy of an object
 *
 * @param {Object} The object to copy
 * @return {Object} The shallow copy object
 */
function shallowCopy(obj) {
    var k, no = {};
    for (k in obj) {
        if (obj.hasOwnProperty(k)) {
            no[k] = obj[k];
        }
    }
    return no;
}

/**
 * Merge the objects passed in into one single object
 *
 * If two objects hav the same field the value in the rightmost
 * object will be picked up.
 *
 * This function takes a variable parameter
 * Any number of objects can be passed in
 * @return {Object} The new merge object
 */
function merge() {
    var newObj = {};
    var i, n, obj, k;
    for (i = 0, n = arguments.length; i < n; i++) {
        obj = arguments[i];
        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                newObj[k] = obj[k];
            }
        }
    }
    return newObj;
}


/**
 * Flatten an Array of Arrays
 *
 * @param {Array} list The array to flatten
 * @return {Array} The flattened array
 */
function flatten(list) {
    var l = [];
    list.forEach(function(el) {
        l = l.concat(el);
    });
    return l;
}

/**
 * Flatten an object by one level by concatenating keys
 * separating them by a '.'
 *
 *
 *
 * @param o The object to flatten
 * @return the flattened object.
 */
function flattenObject(o) {
    var items = objItems(o);
    var flattened = flatten(items.map(function(item) {
        return objItems(item.value).map(function(_item) {
            return { key: item.key + '.' + _item.key, value: _item.value };
        });
    }));
    return obj(flattened);
}


/**
 * Construct an array of arrays where each contains items that contain
 * the same key.
 *
 * This is similar to the groupBy function found in python's itertools library
 * It will only consider items with the same key and adjecent to each other as belonging to the same group.
 *
 * @param originalList {Array} The array of items to group
 * @param keyFunc {Function} The function that returns a key for an item
 */
function groupBy(originalList, keyFunc) {
    var groupList = [],
        subList = [],
        currentKey = keyFunc(originalList[0]),
        i = 0,
        n = originalList.length;

    for (i = 0; i < n; i++) {
        if (keyFunc(originalList[i]) !== currentKey) {
            groupList.push({ key: currentKey, values: subList });
            subList = [];
            currentKey = keyFunc(originalList[i]);
        }
        subList.push(originalList[i]);
    }
    groupList.push({ key: currentKey, values: subList });
    return groupList;

}

/**
 * Construct an object where the values of all elements have
 * been update by a function.
 *
 * @param obj {Object} The object to map over
 * @param func {Function} The update function
 * @return {Object} An object with the updated elements
 */
function mapValues(obj, func) {
    var d = {};
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            d[k] = func(obj[k]);
        }
    }
    return d;
}

/**
 * Bind the method stored in a
 * particular field to the object.
 *
 * This functions exists so that i do not have to have to
 * type obj.field.bind(obj), as i can write bind(obj, 'field')
 * instead.
 *
 * @param obj {Object} The object to bind to
 * @param fnFieldName {Function} The name of the field containing the method
 * @return {Function} A function that is bound to the object
 */
function bind(obj, fnFieldName) {
    return obj[fnFieldName].bind(obj);
}

/**
 * Function composition
 * Given two function f and g
 * create a new function that given a parameter x
 * will return f(g(x))
 */
function fog(f, g) {
    return function(x) {
        return f(g(x));
    };
}

/**
 * Return the inverse of a boolean value
 */
function not(v) {
    return !v;
}

/**
 * Separate the elements of a list into two separate lists
 * based on a predicate.
 *
 * The two lists are returned as elements of a single list.
 * The first element being those items for which the predicate
 * returned true.
 * The second element will contain items for which the predicate\
 * returned false.
 */
function partition(list, predicate) {
    return [
        list.filter(predicate),
        list.filter(fog(not, predicate))
    ];
}


/**
 * Create a lookup table factory for values extracted from a particular field
 *
 * @param service The external service from witch to fetch the table data
 * @param searchField The name of the field to pass to the service
 * @param keyFn The function used to extract the lookup key from the
 service data.
 * @param valueFn The function used to extract the lookup value from
 *        the service data.
 * @return Object deferred that represents the lookup table.
 */
function lookupTableBuilder(service, searchField, keyFn, valueFn) {
    if (keyFn === undefined) { keyFn = col(searchField); }
    if (valueFn === undefined) { valueFn = id; }
    return function(items) {
        var searchFields = uniqueStrings(items.map(col(searchField)));
        return service(searchFields).pipe(deferred.lift(function(found) {
            var indexed = makeTable(found, keyFn, valueFn);
            return function(item) {
                return indexed[item[searchField]];
            };
        }));
    };
}

/**
 * Find an element in an array that matches a particular
 * predicate
 *
 * @param arr
 * @param pred
 * @return {*}
 */
function find(arr, pred) {
    var i, n;
    for (i = 0, n = arr.length; i < n; i++) {
        if (pred(arr[i])) { return arr[i]; }
    }
    return null;
}


/**
 * Get the last element in an array.
 * @param array
 * @return {*}
 */
function last(array) {
    return array[array.length - 1];
}

/**
 * Remove duplicates
 *
 * @param array
 * @param keyFunc
 * @returns {Array}
 */
function dedup(array, keyFunc) {
    var keys = {},
        i, n, newArray = [];
    for (i = 0, n = array.length; i < n; i++) {
        var el = array[i];
        var key = keyFunc(el);
        if (!keys.hasOwnProperty(key)) {
            keys[key] = key;
            newArray.push(el);
        }
    }
    return newArray;
}

/**
 * Construct a function to iterate over an array of items
 * restricting the number of calls that can be made
 * in parallel
 *
 * The iterating function accepts two parameters
 * A function the apply each element to this function also accepts the next
 * operation as a parameter
 * The array to iterate over.
 *
 * @param n The number of parallel requests
 * @return function The iterating function
 */
function asyncForEach(n) {
    return function(f, array) {
        var i = 0,
            j;

        function next() {
            if (i < array.length) {
                var v = array[i];
                i += 1;
                f(v, next);
            }
        }
        for (j = 0; j < n; j++) {
            next();
        }
    };
}

/**
 * Splits the input array into an array of arrays of specified size.
 * @param arr {Array} the input array that should be split
 * @param len {integer} the length
 * @return {Array} result array containing an array of split arrays
 */

function splitArray(arr, len) {
    var counter,
        result = [];
    for (counter = 0; counter < arr.length; counter = counter + len) {
        result.push(arr.slice(counter, counter + len));
    }
    return result;
}

/**
 * Check for the existence of parameters
 * returns false if anyone of required array doesn't exist in params object
 */
function checkExistence(params, required) {
    function check(p) {
        return !params.hasOwnProperty(p);
    }
    if (!required || required.length === 0) { return true; } else if (!params || Object.keys(params).length === 0) { return false; }
    return !(required.some(check));
}

/**
 * Convert a regular node async function
 * into one that returns a deferred
 *
 * @param fn
 * @param parent : parent object on which fn is being applied on.
 */
function defer(fn, parent) {
    return function() {
        var args = Array.prototype.slice.call(arguments, 0);
        return deferred.defer(function(callbacks) {
            function callback(err, result) {
                if (err) {
                    callbacks.failure(err);
                } else {
                    callbacks.success(result);
                }
            }

            args.push(callback);
            fn.apply(parent, args);
        });
    };
}

/*
 * Return true/false with probability p
 */
function returnWithProbability(p) {
    if (p <= 1) { p = p * 100; }
    var number = Math.floor((Math.random() * 100) + 1);
    return number <= p;
}

/** Return size of any object */
function roughSizeOfObject(object) {

    var objectList = [];
    var stack = [object];
    var bytes = 0;

    while (stack.length) {
        var value = stack.pop();

        if (typeof value === 'boolean') {
            bytes += 4;
        } else if (typeof value === 'string') {
            bytes += value.length * 2;
        } else if (typeof value === 'number') {
            bytes += 8;
        } else if (
            typeof value === 'object' &&
            objectList.indexOf(value) === -1
        ) {
            objectList.push(value);

            for (var i in value) {
                stack.push(value[i]);
            }
        }
    }
    return bytes;
}

function distanceFromLatLonInMetre(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Distance in Metre
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}


exports.formatDate = formatDate;
exports.formatTime = formatTime;
exports.formatCurrency = formatCurrency;
exports.makeTable = makeTable;
exports.makeArraysTable = makeArraysTable;
exports.col = col;
exports.id = id;
exports.uniqueStrings = uniqueStrings;
exports.objKeys = objKeys;
exports.objItems = objItems;
exports.shallowCopy = shallowCopy;
exports.merge = merge;
exports.groupBy = groupBy;
exports.mapValues = mapValues;
exports.bind = bind;
exports.fog = fog;
exports.not = not;
exports.partition = partition;
exports.flattenObject = flattenObject;
exports.lookupTableBuilder = lookupTableBuilder;
exports.flatten = flatten;
exports.obj = obj;
exports.find = find;
exports.last = last;
exports.dedup = dedup;
exports.asyncForEach = asyncForEach;
exports.splitArray = splitArray;
exports.checkExistence = checkExistence;
exports.defer = defer;
exports.returnWithProbability = returnWithProbability;
exports.roughSizeOfObject = roughSizeOfObject;
exports.distanceFromLatLonInMetre = distanceFromLatLonInMetre;