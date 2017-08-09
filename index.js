/**
 * @file Tests that all elements in the array pass the provided function.
 * @version 1.0.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module array-every-x
 */

'use strict';

var toObject = require('to-object-x');
var assertIsFunction = require('assert-is-function-x');
var some = require('array-some-x');

var $every = function every(array, callBack /* , thisArg */) {
  var object = toObject(array);
  // If no callback function or if callback is not a callable function
  assertIsFunction(callBack);
  var wrapped = function _wrapped(item, idx, obj) {
    // eslint-disable-next-line no-invalid-this
    return callBack.call(this, item, idx, obj) === false;
  };

  var args = [object, wrapped];
  if (arguments.length > 2) {
    args.push(arguments[2]);
  }

  return some.apply(void 0, args) === false;
};

/**
 * This method tests whether all elements in the array pass the test implemented
 * by the provided function.
 *
 * @param {array} array - The array to iterate over.
 * @param {Function} callBack - Function to test for each element,
 * @param {*} [thisArg] - Value to use as this when executing callback.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @return {boolean} `true` if the callback function returns a truthy value for
 *  every array element; otherwise, `false`.
 * @example
 * var every = require('array-every-x');
 *
 * var items = ['item1', 'item2', 'item3'];
 * var copy = [];
 *
 * every(items, function(item){
 *   copy.push(item)
 * });
 */
module.exports = $every;
