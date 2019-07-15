import every from '../src/array-every-x';

const itHasDoc = typeof document !== 'undefined' && document ? it : xit;

// IE 6 - 8 have a bug where this returns false.
/* eslint-disable-next-line no-void */
const canDistinguish = 0 in [void 0];
const undefinedIfNoSparseBug = canDistinguish
  ? /* eslint-disable-next-line no-void */
    void 0
  : {
      valueOf() {
        return 0;
      },
    };

const createArrayLike = function(arr) {
  const o = {};
  arr.forEach(function(e, i) {
    o[i] = e;
  });

  o.length = arr.length;

  return o;
};

describe('every', function() {
  let actual;
  let expected;
  let testSubject;
  let numberOfRuns;

  /* eslint-disable-next-line jest/no-hooks */
  beforeEach(function() {
    expected = {
      0: 2,
      2: undefinedIfNoSparseBug,
      3: true,
    };

    actual = {};
    numberOfRuns = 0;
    testSubject = [2, 3, undefinedIfNoSparseBug, true, 'hej', null, false, 0];

    delete testSubject[1];
  });

  it('is a function', function() {
    expect.assertions(1);
    expect(typeof every).toBe('function');
  });

  it('should throw when array is null or undefined', function() {
    expect.assertions(3);
    expect(function() {
      every();
    }).toThrowErrorMatchingSnapshot();

    expect(function() {
      /* eslint-disable-next-line no-void */
      every(void 0);
    }).toThrowErrorMatchingSnapshot();

    expect(function() {
      every(null);
    }).toThrowErrorMatchingSnapshot();
  });

  it('should pass the correct values along to the callback', function() {
    expect.assertions(1);
    const callback = jest.fn();
    const array = ['1'];
    every(array, callback);
    expect(callback).toHaveBeenCalledWith('1', 0, array);
  });

  it('should not affect elements added to the array after it has begun', function() {
    expect.assertions(2);
    const arr = [1, 2, 3];

    let i = 0;
    every(arr, function(a) {
      i += 1;
      arr.push(a + 3);

      return i <= 3;
    });

    expect(arr).toStrictEqual([1, 2, 3, 4, 5, 6]);

    expect(i).toBe(3);
  });

  it('should set the right context when given none', function() {
    expect.assertions(1);
    /* eslint-disable-next-line no-void */
    let context = void 0;
    every([1], function() {
      /* eslint-disable-next-line babel/no-invalid-this */
      context = this;
    });

    expect(context).toBe(
      function() {
        /* eslint-disable-next-line babel/no-invalid-this */
        return this;
      }.call(),
    );
  });

  it('should return true if the array is empty', function() {
    expect.assertions(2);
    actual = every([], function() {
      return true;
    });

    expect(actual).toBe(true);

    actual = every([], function() {
      return false;
    });

    expect(actual).toBe(true);
  });

  it('should return true if it runs to the end', function() {
    expect.assertions(1);
    actual = [1, 2, 3].every(function() {
      return true;
    });
    expect(actual).toBe(true);
  });

  it('should return false if it is stopped before the end', function() {
    expect.assertions(1);
    actual = every([1, 2, 3], function() {
      return false;
    });
    expect(actual).toBe(false);
  });

  it('should return after 3 elements', function() {
    expect.assertions(1);
    every(testSubject, function(obj, index) {
      actual[index] = obj;
      numberOfRuns += 1;

      return numberOfRuns !== 3;
    });

    expect(actual).toStrictEqual(expected);
  });

  it('should stop after 3 elements using a context', function() {
    expect.assertions(1);
    const o = {a: actual};
    every(
      testSubject,
      function(obj, index) {
        /* eslint-disable-next-line babel/no-invalid-this */
        this.a[index] = obj;
        numberOfRuns += 1;

        return numberOfRuns !== 3;
      },
      o,
    );

    expect(actual).toStrictEqual(expected);
  });

  it('should stop after 3 elements in an array-like object', function() {
    expect.assertions(1);
    const ts = createArrayLike(testSubject);
    every(ts, function(obj, index) {
      actual[index] = obj;
      numberOfRuns += 1;

      return numberOfRuns !== 3;
    });

    expect(actual).toStrictEqual(expected);
  });

  it('should stop after 3 elements in an array-like object using a context', function() {
    expect.assertions(1);
    const ts = createArrayLike(testSubject);
    const o = {a: actual};
    every(
      ts,
      function(obj, index) {
        /* eslint-disable-next-line babel/no-invalid-this */
        this.a[index] = obj;
        numberOfRuns += 1;

        return numberOfRuns !== 3;
      },
      o,
    );

    expect(actual).toStrictEqual(expected);
  });

  it('should have a boxed object as list argument of callback', function() {
    expect.assertions(2);
    /* eslint-disable-next-line no-void */
    let listArg = void 0;
    every('foo', function(item, index, list) {
      listArg = list;
    });

    expect(typeof listArg).toBe('object');
    expect(Object.prototype.toString.call(listArg)).toBe('[object String]');
  });

  it('should work with arguments', function() {
    expect.assertions(1);
    const argObj = (function() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments;
    })('1');

    const callback = jest.fn();
    every(argObj, callback);
    expect(callback).toHaveBeenCalledWith('1', 0, argObj);
  });

  it('should work with strings', function() {
    expect.assertions(1);
    const callback = jest.fn();
    const string = '1';
    every(string, callback);
    expect(callback).toHaveBeenCalledWith('1', 0, string);
  });

  itHasDoc('should work wih DOM elements', function() {
    expect.assertions(1);
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');
    fragment.appendChild(div);
    const callback = jest.fn();
    every(fragment.childNodes, callback);
    expect(callback).toHaveBeenCalledWith(div, 0, fragment.childNodes);
  });
});
