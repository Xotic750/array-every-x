<a href="https://travis-ci.org/Xotic750/array-every-x"
   title="Travis status">
<img
   src="https://travis-ci.org/Xotic750/array-every-x.svg?branch=master"
   alt="Travis status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/array-every-x"
   title="Dependency status">
<img src="https://david-dm.org/Xotic750/array-every-x.svg"
   alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/array-every-x#info=devDependencies"
   title="devDependency status">
<img src="https://david-dm.org/Xotic750/array-every-x/dev-status.svg"
   alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/array-every-x" title="npm version">
<img src="https://badge.fury.io/js/array-every-x.svg"
   alt="npm version" height="18"/>
</a>
<a name="module_array-every-x"></a>

## array-every-x
Tests that all elements in the array pass the provided function.

**Version**: 2.0.0  
**Author**: Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
<a name="exp_module_array-every-x--module.exports"></a>

### `module.exports` ⇒ <code>boolean</code> ⏏
This method tests whether all elements in the array pass the test implemented
by the provided function.

**Kind**: Exported member  
**Returns**: <code>boolean</code> - `true` if the callback function returns a truthy value for
 every array element; otherwise, `false`.  
**Throws**:

- <code>TypeError</code> If array is null or undefined.
- <code>TypeError</code> If callBack is not a function.


| Param | Type | Description |
| --- | --- | --- |
| array | <code>array</code> | The array to iterate over. |
| callBack | <code>function</code> | Function to test for each element. |
| [thisArg] | <code>\*</code> | Value to use as this when executing callback. |

**Example**  
```js
var every = require('array-every-x');

function isBigEnough(element, index, array) {
  return element >= 10;
}
every([12, 5, 8, 130, 44], isBigEnough);   // false
every([12, 54, 18, 130, 44], isBigEnough); // true
```
