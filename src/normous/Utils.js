var Utils = Utils || {};


Utils.extend = function() {
	var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean") {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !Utils.isFunction(target)) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if (length === i) {
		target = this; --i;
	}

	for (; i < length; i++) {
		// Only deal with non-null/undefined values
		if (( options = arguments[i]) !== null) {
			// Extend the base object
			for (name in options ) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (Utils.isObject(copy) || ( copyIsArray = Utils.isArrayLike(copy)) )) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Utils.isArrayLike(src) ? src : [];

					} else {
						clone = src && Utils.isObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = Utils.extend(deep, clone, copy);

					// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};


Utils.typeOf = function(value) {
	var s = typeof value;
	if (s === 'object') {
		if (value) {
			// Check these first, so we can avoid calling Object.prototype.toString if
			// possible.
			//
			// IE improperly marshals tyepof across execution contexts, but a
			// cross-context object will still return false for "instanceof Object".
			if ( value instanceof Array) {
				return 'array';
			} else if ( value instanceof Object) {
				return s;
			}

			// HACK: In order to use an Object prototype method on the arbitrary
			//   value, the compiler requires the value be cast to type Object,
			//   even though the ECMA spec explicitly allows it.
			var className = Object.prototype.toString.call(
			/** @type {Object} */(value));
			// In Firefox 3.6, attempting to access iframe window objects' length
			// property throws an NS_ERROR_FAILURE, so we need to special-case it
			// here.
			if (className === '[object Window]') {
				return 'object';
			}

			// We cannot always use constructor == Array or instanceof Array because
			// different frames have different Array objects. In IE6, if the iframe
			// where the array was created is destroyed, the array loses its
			// prototype. Then dereferencing val.splice here throws an exception, so
			// we can't use Utils.isFunction. Calling typeof directly returns 'unknown'
			// so that will work. In this case, this function will return false and
			// most array functions will still work because the array is still
			// array-like (supports length and []) even though it has lost its
			// prototype.
			// Mark Miller noticed that Object.prototype.toString
			// allows access to the unforgeable [[Class]] property.
			//  15.2.4.2 Object.prototype.toString ( )
			//  When the toString method is called, the following steps are taken:
			//      1. Get the [[Class]] property of this object.
			//      2. Compute a string value by concatenating the three strings
			//         "[object ", Result(1), and "]".
			//      3. Return Result(2).
			// and this behavior survives the destruction of the execution context.
			if ((className === '[object Array]' ||
			// In IE all non value types are wrapped as objects across window
			// boundaries (not iframe though) so we have to do object detection
			// for this edge case
			typeof value.length === 'number' && typeof value.splice !== 'undefined' && typeof value.propertyIsEnumerable !== 'undefined' && !value.propertyIsEnumerable('splice')

			)) {
				return 'array';
			}
			// HACK: There is still an array case that fails.
			//     function ArrayImpostor() {}
			//     ArrayImpostor.prototype = [];
			//     var impostor = new ArrayImpostor;
			// this can be fixed by getting rid of the fast path
			// (value instanceof Array) and solely relying on
			// (value && Object.prototype.toString.vall(value) === '[object Array]')
			// but that would require many more function calls and is not warranted
			// unless closure code is receiving objects from untrusted sources.

			// IE in cross-window calls does not correctly marshal the function type
			// (it appears just as an object) so we cannot use just typeof val ==
			// 'function'. However, if the object has a call property, it is a
			// function.
			if ((className === '[object Function]' || typeof value.call !== 'undefined' && typeof value.propertyIsEnumerable !== 'undefined' && !value.propertyIsEnumerable('call'))) {
				return 'function';
			}

		} else {
			return 'null';
		}

	} else if (s === 'function' && typeof value.call === 'undefined') {
		// In Safari typeof nodeList returns 'function', and on Firefox
		// typeof behaves similarly for HTML{Applet,Embed,Object}Elements
		// and RegExps.  We would like to return object for those and we can
		// detect an invalid function by making sure that the function
		// object has a call method.
		return 'object';
	}
	return s;
};


/**
 * Returns true if the specified value is not |undefined|.
 * WARNING: Do not use this to test if an object has a property. Use the in
 * operator instead.  Additionally, this function assumes that the global
 * undefined variable has not been redefined.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is defined.
 */
Utils.isDefined = function(val) {
	return val !== undefined;
};

/**
 * Returns true if the specified value is |null|
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is null.
 */
Utils.isNull = function(val) {
	return val === null;
};

/**
 * Returns true if the specified value is defined and not null
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is defined and not null.
 */
Utils.isDefinedAndNotNull = function(val) {
	// Note that undefined == null.
	return val != null;
};

/**
 * Returns true if the specified value is an array
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
Utils.isArray = function(val) {
	return Utils.typeOf(val) === 'array';
};

/**
 * Returns true if the object looks like an array. To qualify as array like
 * the value needs to be either a NodeList or an object with a Number length
 * property.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
Utils.isArrayLike = function(val) {
	var type = Utils.typeOf(val);
	return type === 'array' || type === 'object' && typeof val.length === 'number';
};

/**
 * Returns true if the object looks like a Date. To qualify as Date-like
 * the value needs to be an object and have a getFullYear() function.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a like a Date.
 */
Utils.isDateLike = function(val) {
	return Utils.isObject(val) && typeof val.getFullYear === 'function';
};

/**
 * Returns true if the specified value is a string
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a string.
 */
Utils.isString = function(val) {
	return typeof val === 'string';
};

/**
 * Returns true if the specified value is a boolean
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is boolean.
 */
Utils.isBoolean = function(val) {
	return typeof val === 'boolean';
};

/**
 * Returns true if the specified value is a number
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a number.
 */
Utils.isNumber = function(val) {
	return typeof val === 'number';
};

/**
 * Returns true if the specified value is a function
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a function.
 */
Utils.isFunction = function(val) {
	return Utils.typeOf(val) === 'function';
};

/**
 * Returns true if the specified value is an object.  This includes arrays
 * and functions.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an object.
 */
Utils.isObject = function(val) {
	var type = typeof val;
	return type === 'object' && val !== null || type === 'function';
	// return Object(val) === val also works, but is slower, especially if val is
	// not an object.
};

/**
 * Clones a value. The input may be an Object, Array, or basic type. Objects and
 * arrays will be cloned recursively.
 *
 * WARNINGS:
 * <code>Utils.cloneObject</code> does not detect reference loops. Objects that
 * refer to themselves will cause infinite recursion.
 *
 * <code>Utils.cloneObject</code> is unaware of unique identifiers, and copies
 * UIDs created by <code>getUid</code> into cloned results.
 *
 * @param {*} obj The value to clone.
 * @return {*} A clone of the input value.
 * @deprecated Utils.cloneObject is unsafe. Prefer the Utils.object methods.
 */
Utils.cloneObject = function(obj) {
	var type = Utils.typeOf(obj);
	if (type === 'object' || type === 'array') {
		if (obj.clone) {
			return obj.clone();
		}
		var clone = type === 'array' ? [] : {};
		for (var key in obj) {
			clone[key] = Utils.cloneObject(obj[key]);
		}
		return clone;
	}

	return obj;
};

/**
 * A native implementation of Utils.bind.
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which |this| should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially
 *     applied to the function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @private
 * @suppress {deprecated} The compiler thinks that Function.prototype.bind
 *     is deprecated because some people have declared a pure-JS version.
 *     Only the pure-JS version is truly deprecated.
 */
Utils._bindNative = function(fn, selfObj, var_args) {
	return /** @type {!Function} */(fn.call.apply(fn.bind, arguments));
};

/**
 * A pure-JS implementation of Utils.bind.
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which |this| should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially
 *     applied to the function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @private
 */
Utils._bindJavascript = function(fn, selfObj, var_args) {
	if (!fn) {
		throw new Error();
	}

	if (arguments.length > 2) {
		var boundArgs = Array.prototype.slice.call(arguments, 2);
		return function() {
			// Prepend the bound arguments to the current arguments.
			var newArgs = Array.prototype.slice.call(arguments);
			Array.prototype.unshift.apply(newArgs, boundArgs);
			return fn.apply(selfObj, newArgs);
		};

	} else {
		return function() {
			return fn.apply(selfObj, arguments);
		};
	}
};

Utils.indexOf = function(elem, arr, i) {
	var len;

	if (arr) {
		if (Array.prototype.indexOf) {
			return Array.prototype.indexOf.call(arr, elem, i);
		}

		len = arr.length;
		i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

		for (; i < len; i++) {
			// Skip accessing in sparse arrays
			if ( i in arr && arr[i] === elem) {
				return i;
			}
		}
	}

	return -1;
}; 

/**
 * Partially applies this function to a particular 'this object' and zero or
 * more arguments. The result is a new function with some arguments of the first
 * function pre-filled and the value of |this| 'pre-specified'.<br><br>
 *
 * Remaining arguments specified at call-time are appended to the pre-
 * specified ones.<br><br>
 *
 * Also see: {@link #partial}.<br><br>
 *
 * Usage:
 * <pre>var barMethBound = bind(myFunction, myObj, 'arg1', 'arg2');
 * barMethBound('arg3', 'arg4');</pre>
 *
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which |this| should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially
 *     applied to the function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @suppress {deprecated} See above.
 */
Utils.bind = function(fn, selfObj, var_args) {
	// TODO(nicksantos): narrow the type signature.
	if (Function.prototype.bind &&
	// NOTE(nicksantos): Somebody pulled base.js into the default
	// Chrome extension environment. This means that for Chrome extensions,
	// they get the implementation of Function.prototype.bind that
	// calls Utils.bind instead of the native one. Even worse, we don't want
	// to introduce a circular dependency between Utils.bind and
	// Function.prototype.bind, so we have to hack this to make sure it
	// works correctly.
	Function.prototype.bind.toString().indexOf('native code') !== -1) {
		Utils.bind = Utils._bindNative;
	} else {
		Utils.bind = Utils._bindJavascript;
	}
	return Utils.bind.apply(null, arguments);
}; 


module.exports = Utils;