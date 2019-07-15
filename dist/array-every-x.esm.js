var _this = this;

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

import attempt from 'attempt-x';
import splitIfBoxedBug from 'split-if-boxed-bug-x';
import toLength from 'to-length-x';
import toObject from 'to-object-x';
import assertIsFunction from 'assert-is-function-x';
/** @type {ArrayConstructor} */

var ArrayCtr = [].constructor;
/** @type {ObjectConstructor} */

var castObject = {}.constructor;
/** @type {BooleanConstructor} */

var castBoolean = true.constructor;
var nativEvery = typeof ArrayCtr.prototype.every === 'function' && ArrayCtr.prototype.every;
var isWorking;

if (nativEvery) {
  var spy = 0;
  var res = attempt.call([1, 2], nativEvery, function (item) {
    _newArrowCheck(this, _this);

    spy += item;
    return true;
  }.bind(this));
  isWorking = res.threw === false && res.value === true && spy === 3;

  if (isWorking) {
    spy = '';
    res = attempt.call(castObject('abc'), nativEvery, function (item, index) {
      _newArrowCheck(this, _this);

      spy += item;
      return index !== 2;
    }.bind(this));
    isWorking = res.threw === false && res.value === false && spy === 'abc';
  }

  if (isWorking) {
    spy = 0;
    res = attempt.call(function getArgs() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments;
    }(1, 2, 3), nativEvery, function (item, index) {
      _newArrowCheck(this, _this);

      spy += item;
      return index !== 1;
    }.bind(this));
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
      _newArrowCheck(this, _this);

      spy += item;
      return true;
    }.bind(this));
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
        _newArrowCheck(this, _this);

        spy = item;
      }.bind(this));
      isWorking = res.threw === false && res.value === false && spy === div;
    }
  }

  if (isWorking) {
    var isStrict = function returnIsStrict() {
      /* eslint-disable-next-line babel/no-invalid-this */
      return castBoolean(this) === false;
    }();

    if (isStrict) {
      spy = null;
      res = attempt.call([1], nativEvery, function () {
        _newArrowCheck(this, _this);

        /* eslint-disable-next-line babel/no-invalid-this */
        spy = typeof this === 'string';
      }.bind(this), 'x');
      isWorking = res.threw === false && res.value === false && spy === true;
    }
  }

  if (isWorking) {
    spy = {};
    var fn = ['return nativEvery.call("foo", function (_, __, context) {', 'if (castBoolean(context) === false || typeof context !== "object") {', 'spy.value = true;}});'].join('');
    /* eslint-disable-next-line no-new-func */

    res = attempt(Function('nativEvery', 'spy', 'castBoolean', fn), nativEvery, spy);
    isWorking = res.threw === false && res.value === false && spy.value !== true;
  }
}
/**
 * This method tests whether all elements in the array pass the test implemented
 * by the provided function.
 *
 * @param {Array} array - The array to iterate over.
 * @param {Function} callBack - Function to test for each element.
 * @param {*} [thisArg] - Value to use as this when executing callback.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @returns {boolean} `true` if the callback function returns a truthy value for
 *  every array element; otherwise, `false`.
 */


var $every;

if (nativEvery) {
  $every = function every(array, callBack
  /* , thisArg */
  ) {
    var args = [callBack];

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      args[1] = arguments[2];
    }

    return nativEvery.apply(array, args);
  };
} else {
  $every = function every(array, callBack
  /* , thisArg */
  ) {
    var object = toObject(array); // If no callback function or if callback is not a callable function

    assertIsFunction(callBack);
    var iterable = splitIfBoxedBug(object);
    var length = toLength(iterable.length);
    var thisArg;

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      thisArg = arguments[2];
    }

    var noThis = typeof thisArg === 'undefined';

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

var arrayEvery = $every;
export default arrayEvery;

//# sourceMappingURL=array-every-x.esm.js.map