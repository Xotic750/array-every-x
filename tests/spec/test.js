'use strict';

var every;
if (typeof module === 'object' && module.exports) {
  require('es5-shim');
  require('es5-shim/es5-sham');
  if (typeof JSON === 'undefined') {
    JSON = {};
  }
  require('json3').runInContext(null, JSON);
  require('es6-shim');
  var es7 = require('es7-shim');
  Object.keys(es7).forEach(function (key) {
    var obj = es7[key];
    if (typeof obj.shim === 'function') {
      obj.shim();
    }
  });
  every = require('../../index.js');
} else {
  every = returnExports;
}

// IE 6 - 8 have a bug where this returns false.
var canDistinguish = 0 in [void 0];
var undefinedIfNoSparseBug = canDistinguish ? void 0 : {
  valueOf: function () {
    return 0;
  }
};

var createArrayLike = function (arr) {
  var o = {};
  arr.forEach(function (e, i) {
    o[i] = e;
  });

  o.length = arr.length;
  return o;
};

describe('every', function () {
  var actual;
  var expected;
  var testSubject;
  var numberOfRuns;

  beforeEach(function () {
    expected = {
      0: 2,
      2: undefinedIfNoSparseBug,
      3: true
    };

    actual = {};
    numberOfRuns = 0;
    testSubject = [
      2,
      3,
      undefinedIfNoSparseBug,
      true,
      'hej',
      null,
      false,
      0
    ];

    delete testSubject[1];
  });

  it('is a function', function () {
    expect(typeof every).toBe('function');
  });

  it('should throw when array is null or undefined', function () {
    expect(function () {
      every();
    }).toThrow();

    expect(function () {
      every(void 0);
    }).toThrow();

    expect(function () {
      every(null);
    }).toThrow();
  });

  it('should pass the correct values along to the callback', function () {
    var callback = jasmine.createSpy('callback');
    var array = ['1'];
    every(array, callback);
    expect(callback).toHaveBeenCalledWith('1', 0, array);
  });

  it('should not affect elements added to the array after it has begun', function () {
    var arr = [
      1,
      2,
      3
    ];

    var i = 0;
    every(arr, function (a) {
      i += 1;
      arr.push(a + 3);
      return i <= 3;
    });

    expect(arr).toEqual([
      1,
      2,
      3,
      4,
      5,
      6
    ]);

    expect(i).toBe(3);
  });

  it('should set the right context when given none', function () {
    var context;
    every([1], function () {
      // eslint-disable-next-line no-invalid-this
      context = this;
    });

    expect(context).toBe(function () {
      // eslint-disable-next-line no-invalid-this
      return this;
    }.call());
  });

  it('should return true if the array is empty', function () {
    actual = every([], function () {
      return true;
    });

    expect(actual).toBe(true);

    actual = every([], function () {
      return false;
    });

    expect(actual).toBe(true);
  });

  it('should return true if it runs to the end', function () {
    actual = [
      1,
      2,
      3
    ].every(function () { return true; });
    expect(actual).toBe(true);
  });

  it('should return false if it is stopped before the end', function () {
    actual = every([
      1,
      2,
      3
    ], function () { return false; });
    expect(actual).toBe(false);
  });

  it('should return after 3 elements', function () {
    every(testSubject, function (obj, index) {
      actual[index] = obj;
      numberOfRuns += 1;
      return numberOfRuns !== 3;
    });

    expect(actual).toEqual(expected);
  });

  it('should stop after 3 elements using a context', function () {
    var o = { a: actual };
    every(testSubject, function (obj, index) {
      // eslint-disable-next-line no-invalid-this
      this.a[index] = obj;
      numberOfRuns += 1;
      return numberOfRuns !== 3;
    }, o);

    expect(actual).toEqual(expected);
  });

  it('should stop after 3 elements in an array-like object', function () {
    var ts = createArrayLike(testSubject);
    every(ts, function (obj, index) {
      actual[index] = obj;
      numberOfRuns += 1;
      return numberOfRuns !== 3;
    });

    expect(actual).toEqual(expected);
  });

  it('should stop after 3 elements in an array-like object using a context', function () {
    var ts = createArrayLike(testSubject);
    var o = { a: actual };
    every(ts, function (obj, index) {
      // eslint-disable-next-line no-invalid-this
      this.a[index] = obj;
      numberOfRuns += 1;
      return numberOfRuns !== 3;
    }, o);

    expect(actual).toEqual(expected);
  });

  it('should have a boxed object as list argument of callback', function () {
    var listArg;
    every('foo', function (item, index, list) {
      listArg = list;
    });

    expect(typeof listArg).toBe('object');
    expect(Object.prototype.toString.call(listArg)).toBe('[object String]');
  });
});
