/**
 * @file Tests that all elements in the array pass the provided function.
 * @version 2.2.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module array-every-x
 */

'use strict';

var nativEvery = typeof Array.prototype.every === 'function' && Array.prototype.every;

var isWorking;
if (nativEvery) {
  var attempt = require('attempt-x');
  var spy = 0;
  var res = attempt.call([1, 2], nativEvery, function (item) {
    spy += item;
    return true;
  });

  isWorking = res.threw === false && res.value === true && spy === 3;

  if (isWorking) {
    spy = '';
    res = attempt.call(Object('abc'), nativEvery, function (item, index) {
      spy += item;
      return index !== 2;
    });

    isWorking = res.threw === false && res.value === false && spy === 'abc';
  }

  if (isWorking) {
    spy = 0;
    res = attempt.call((function () {
      return arguments;
    }(1, 2, 3)), nativEvery, function (item, index) {
      spy += item;
      return index !== 1;
    });

    isWorking = res.threw === false && res.value === false && spy === 3;
  }

  if (isWorking) {
    spy = 0;
    res = attempt.call({
      0: 1,
      1: 2,
      3: 3,
      4: 4,
      length: 4
    }, nativEvery, function (item) {
      spy += item;
      return true;
    });

    isWorking = res.threw === false && res.value === true && spy === 6;
  }

  if (isWorking) {
    var doc = typeof document !== 'undefined' && document;
    if (doc) {
      spy = null;
      var fragment = doc.createDocumentFragment();
      var div = doc.createElement('div');
      fragment.appendChild(div);
      res = attempt.call(fragment.childNodes, nativEvery, function (item) {
        spy = item;
      });

      isWorking = res.threw === false && res.value === false && spy === div;
    }
  }

  if (isWorking) {
    var isStrict = (function () {
      // eslint-disable-next-line no-invalid-this
      return Boolean(this) === false;
    }());

    if (isStrict) {
      spy = null;
      res = attempt.call([1], nativEvery, function () {
        // eslint-disable-next-line no-invalid-this
        spy = typeof this === 'string';
      }, 'x');

      isWorking = res.threw === false && res.value === false && spy === true;
    }
  }

  if (isWorking) {
    spy = {};
    var fn = [
      'return nativEvery.call("foo", function (_, __, context) {',
      'if (Boolean(context) === false || typeof context !== "object") {',
      'spy.value = true;}});'
    ].join('');

    // eslint-disable-next-line no-new-func
    res = attempt(Function('nativEvery', 'spy', fn), nativEvery, spy);

    isWorking = res.threw === false && res.value === false && spy.value !== true;
  }
}

var $every;
if (nativEvery) {
  $every = function every(array, callBack /* , thisArg */) {
    var args = [callBack];
    if (arguments.length > 2) {
      args[1] = arguments[2];
    }

    return nativEvery.apply(array, args);
  };
} else {
  var splitIfBoxedBug = require('split-if-boxed-bug-x');
  var toLength = require('to-length-x');
  var isUndefined = require('validate.io-undefined');
  var toObject = require('to-object-x');
  var assertIsFunction = require('assert-is-function-x');

  $every = function every(array, callBack /* , thisArg */) {
    var object = toObject(array);
    // If no callback function or if callback is not a callable function
    assertIsFunction(callBack);
    var iterable = splitIfBoxedBug(object);
    var length = toLength(iterable.length);
    var thisArg;
    if (arguments.length > 2) {
      thisArg = arguments[2];
    }

    var noThis = isUndefined(thisArg);
    for (var i = 0; i < length; i += 1) {
      if (i in iterable) {
        var item = iterable[i];
        if ((noThis ? callBack(item, i, object) : callBack.call(thisArg, item, i, object)) === false) {
          return false;
        }
      }
    }

    return true;
  };
}
/**
 * This method tests whether all elements in the array pass the test implemented
 * by the provided function.
 *
 * @param {array} array - The array to iterate over.
 * @param {Function} callBack - Function to test for each element.
 * @param {*} [thisArg] - Value to use as this when executing callback.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @returns {boolean} `true` if the callback function returns a truthy value for
 *  every array element; otherwise, `false`.
 * @example
 * var every = require('array-every-x');
 *
 * function isBigEnough(element, index, array) {
 *   return element >= 10;
 * }
 * every([12, 5, 8, 130, 44], isBigEnough);   // false
 * every([12, 54, 18, 130, 44], isBigEnough); // true
 */
module.exports = $every;
