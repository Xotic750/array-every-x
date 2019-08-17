import attempt from 'attempt-x';
import toObject from 'to-object-x';
import assertIsFunction from 'assert-is-function-x';
import requireObjectCoercible from 'require-object-coercible-x';
import toBoolean from 'to-boolean-x';
import any from 'array-any-x';
import methodize from 'simple-methodize-x';
import call from 'simple-call-x';
var ne = [].every;
var nativeEvery = typeof ne === 'function' && methodize(ne);

var test1 = function test1() {
  var spy = 0;
  var res = attempt(function attemptee() {
    return nativeEvery([1, 2], function spyAdd1(item) {
      spy += item;
      return true;
    });
  });
  return res.threw === false && res.value === true && spy === 3;
};

var test2 = function test2() {
  var spy = '';
  var res = attempt(function attemptee() {
    return nativeEvery(toObject('abc'), function spyAdd2(item, index) {
      spy += item;
      return index !== 2;
    });
  });
  return res.threw === false && res.value === false && spy === 'abc';
};

var test3 = function test3() {
  var spy = 0;
  var res = attempt(function attemptee() {
    var args = function getArgs() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments;
    }(1, 2, 3);

    return nativeEvery(args, function spyAdd3(item, index) {
      spy += item;
      return index !== 1;
    });
  });
  return res.threw === false && res.value === false && spy === 3;
};

var test4 = function test4() {
  var spy = 0;
  var res = attempt(function attemptee() {
    return nativeEvery({
      0: 1,
      1: 2,
      3: 3,
      4: 4,
      length: 4
    }, function spyAdd4(item) {
      spy += item;
      return true;
    });
  });
  return res.threw === false && res.value === true && spy === 6;
};

var doc = typeof document !== 'undefined' && document;

var test5 = function test5() {
  if (doc) {
    var spy = null;
    var fragment = doc.createDocumentFragment();
    var div = doc.createElement('div');
    fragment.appendChild(div);
    var res = attempt(function attemptee() {
      return nativeEvery(fragment.childNodes, function spyAssign(item) {
        spy = item;
      });
    });
    return res.threw === false && res.value === false && spy === div;
  }

  return true;
};

var isStrict = function returnIsStrict() {
  /* eslint-disable-next-line babel/no-invalid-this */
  return toBoolean(this) === false;
}();

var test6 = function test6() {
  if (isStrict) {
    var spy = null;

    var testThis = function testThis() {
      /* eslint-disable-next-line babel/no-invalid-this */
      spy = typeof this === 'string';
    };

    var res = attempt(function attemptee() {
      return nativeEvery([1], testThis, 'x');
    });
    return res.threw === false && res.value === false && spy === true;
  }

  return true;
};

var test7 = function test7() {
  var spy = {};
  var fn = 'return nativeEvery("foo", function (_, __, context) {' + 'if (toBoolean(context) === false || typeof context !== "object") {' + 'spy.value = true;}});';
  var res = attempt(function attemptee() {
    /* eslint-disable-next-line no-new-func */
    return Function('nativeEvery', 'spy', 'toBoolean', fn)(nativeEvery, spy, toBoolean);
  });
  return res.threw === false && res.value === false && spy.value !== true;
};

var isWorking = toBoolean(nativeEvery) && test1() && test2() && test3() && test4() && test5() && test6() && test7();

var patchedEvery = function every(array, callBack
/* , thisArg */
) {
  /* eslint-disable-next-line prefer-rest-params */
  return nativeEvery(requireObjectCoercible(array), assertIsFunction(callBack), arguments[2]);
};

export var implementation = function every(array, callBack
/* , thisArg */
) {
  var object = toObject(array); // If no callback function or if callback is not a callable function

  assertIsFunction(callBack);

  var iteratee = function iteratee() {
    /* eslint-disable-next-line prefer-rest-params */
    var i = arguments[1];
    /* eslint-disable-next-line prefer-rest-params,babel/no-invalid-this */

    return i in arguments[2] && call(callBack, this, [arguments[0], i, object]) === false;
  };
  /* eslint-disable-next-line prefer-rest-params */


  return any(object, iteratee, arguments[2]) === false;
};
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

var $every = isWorking ? patchedEvery : implementation;
export default $every;

//# sourceMappingURL=array-every-x.esm.js.map