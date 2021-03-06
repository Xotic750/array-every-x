import attempt from 'attempt-x';
import toObject from 'to-object-x';
import assertIsFunction from 'assert-is-function-x';
import requireObjectCoercible from 'require-object-coercible-x';
import toBoolean from 'to-boolean-x';
import any from 'array-any-x';
import methodize from 'simple-methodize-x';
import call from 'simple-call-x';

const ne = [].every;
const nativeEvery = typeof ne === 'function' && methodize(ne);

const test1 = function test1() {
  let spy = 0;
  const res = attempt(function attemptee() {
    return nativeEvery([1, 2], function spyAdd1(item) {
      spy += item;

      return true;
    });
  });

  return res.threw === false && res.value === true && spy === 3;
};

const test2 = function test2() {
  let spy = '';
  const res = attempt(function attemptee() {
    return nativeEvery(toObject('abc'), function spyAdd2(item, index) {
      spy += item;

      return index !== 2;
    });
  });

  return res.threw === false && res.value === false && spy === 'abc';
};

const test3 = function test3() {
  let spy = 0;
  const res = attempt(function attemptee() {
    const args = (function getArgs() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments;
    })(1, 2, 3);

    return nativeEvery(args, function spyAdd3(item, index) {
      spy += item;

      return index !== 1;
    });
  });

  return res.threw === false && res.value === false && spy === 3;
};

const test4 = function test4() {
  let spy = 0;
  const res = attempt(function attemptee() {
    return nativeEvery({0: 1, 1: 2, 3: 3, 4: 4, length: 4}, function spyAdd4(item) {
      spy += item;

      return true;
    });
  });

  return res.threw === false && res.value === true && spy === 6;
};

const doc = typeof document !== 'undefined' && document;

const test5 = function test5() {
  if (doc) {
    let spy = null;
    const fragment = doc.createDocumentFragment();
    const div = doc.createElement('div');
    fragment.appendChild(div);
    const res = attempt(function attemptee() {
      return nativeEvery(fragment.childNodes, function spyAssign(item) {
        spy = item;
      });
    });

    return res.threw === false && res.value === false && spy === div;
  }

  return true;
};

const isStrict = (function returnIsStrict() {
  /* eslint-disable-next-line babel/no-invalid-this */
  return toBoolean(this) === false;
})();

const test6 = function test6() {
  if (isStrict) {
    let spy = null;
    const testThis = function testThis() {
      /* eslint-disable-next-line babel/no-invalid-this */
      spy = typeof this === 'string';
    };

    const res = attempt(function attemptee() {
      return nativeEvery([1], testThis, 'x');
    });

    return res.threw === false && res.value === false && spy === true;
  }

  return true;
};

const test7 = function test7() {
  const spy = {};
  const fn =
    'return nativeEvery("foo", function (_, __, context) {' +
    'if (toBoolean(context) === false || typeof context !== "object") {' +
    'spy.value = true;}});';

  const res = attempt(function attemptee() {
    /* eslint-disable-next-line no-new-func */
    return Function('nativeEvery', 'spy', 'toBoolean', fn)(nativeEvery, spy, toBoolean);
  });

  return res.threw === false && res.value === false && spy.value !== true;
};

const isWorking = toBoolean(nativeEvery) && test1() && test2() && test3() && test4() && test5() && test6() && test7();

const patchedEvery = function every(array, callBack /* , thisArg */) {
  /* eslint-disable-next-line prefer-rest-params */
  return nativeEvery(requireObjectCoercible(array), assertIsFunction(callBack), arguments[2]);
};

export const implementation = function every(array, callBack /* , thisArg */) {
  const object = toObject(array);
  // If no callback function or if callback is not a callable function
  assertIsFunction(callBack);

  const iteratee = function iteratee() {
    /* eslint-disable-next-line prefer-rest-params */
    const i = arguments[1];

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
const $every = isWorking ? patchedEvery : implementation;

export default $every;
