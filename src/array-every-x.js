import attempt from 'attempt-x';
import splitIfBoxedBug from 'split-if-boxed-bug-x';
import toLength from 'to-length-x';
import toObject from 'to-object-x';
import assertIsFunction from 'assert-is-function-x';

/** @type {ArrayConstructor} */
const ArrayCtr = [].constructor;
/** @type {ObjectConstructor} */
const castObject = {}.constructor;
/** @type {BooleanConstructor} */
const castBoolean = true.constructor;
const nativEvery = typeof ArrayCtr.prototype.every === 'function' && ArrayCtr.prototype.every;

let isWorking;

if (nativEvery) {
  let spy = 0;
  let res = attempt.call([1, 2], nativEvery, (item) => {
    spy += item;

    return true;
  });

  isWorking = res.threw === false && res.value === true && spy === 3;

  if (isWorking) {
    spy = '';
    res = attempt.call(castObject('abc'), nativEvery, (item, index) => {
      spy += item;

      return index !== 2;
    });

    isWorking = res.threw === false && res.value === false && spy === 'abc';
  }

  if (isWorking) {
    spy = 0;
    res = attempt.call(
      (function getArgs() {
        /* eslint-disable-next-line prefer-rest-params */
        return arguments;
      })(1, 2, 3),
      nativEvery,
      (item, index) => {
        spy += item;

        return index !== 1;
      },
    );

    isWorking = res.threw === false && res.value === false && spy === 3;
  }

  if (isWorking) {
    spy = 0;
    res = attempt.call(
      {
        0: 1,
        1: 2,
        3: 3,
        4: 4,
        length: 4,
      },
      nativEvery,
      (item) => {
        spy += item;

        return true;
      },
    );

    isWorking = res.threw === false && res.value === true && spy === 6;
  }

  if (isWorking) {
    const doc = typeof document !== 'undefined' && document;

    if (doc) {
      spy = null;
      const fragment = doc.createDocumentFragment();
      const div = doc.createElement('div');
      fragment.appendChild(div);
      res = attempt.call(fragment.childNodes, nativEvery, (item) => {
        spy = item;
      });

      isWorking = res.threw === false && res.value === false && spy === div;
    }
  }

  if (isWorking) {
    const isStrict = (function returnIsStrict() {
      /* eslint-disable-next-line babel/no-invalid-this */
      return castBoolean(this) === false;
    })();

    if (isStrict) {
      spy = null;
      res = attempt.call(
        [1],
        nativEvery,
        () => {
          /* eslint-disable-next-line babel/no-invalid-this */
          spy = typeof this === 'string';
        },
        'x',
      );

      isWorking = res.threw === false && res.value === false && spy === true;
    }
  }

  if (isWorking) {
    spy = {};
    const fn = [
      'return nativEvery.call("foo", function (_, __, context) {',
      'if (castBoolean(context) === false || typeof context !== "object") {',
      'spy.value = true;}});',
    ].join('');

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
let $every;

if (nativEvery) {
  $every = function every(array, callBack /* , thisArg */) {
    const args = [callBack];

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      args[1] = arguments[2];
    }

    return nativEvery.apply(array, args);
  };
} else {
  $every = function every(array, callBack /* , thisArg */) {
    const object = toObject(array);
    // If no callback function or if callback is not a callable function
    assertIsFunction(callBack);
    const iterable = splitIfBoxedBug(object);
    const length = toLength(iterable.length);
    let thisArg;

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      thisArg = arguments[2];
    }

    const noThis = typeof thisArg === 'undefined';
    for (let i = 0; i < length; i += 1) {
      if (i in iterable) {
        const item = iterable[i];

        if ((noThis ? callBack(item, i, object) : callBack.call(thisArg, item, i, object)) === false) {
          return false;
        }
      }
    }

    return true;
  };
}

const arrayEvery = $every;

export default arrayEvery;
