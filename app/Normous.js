
var Normous = Normous || {};
Normous.Utils = Normous.Utils || {};
Normous.global = window;

Normous.namespace = function(name) {
	if (Normous.isNamespace(name)) {
		throw new Error('Namespace "' + name + '" already declared.');
	}
	delete Normous._implicitNamespaceDictionary[name];

	var namespace = name;
	while (( namespace = namespace.substring(0, namespace.lastIndexOf('.')))) {
		if (Normous.getObjectByName(namespace)) {
			break;
		}
		Normous._implicitNamespaceDictionary[namespace] = true;
	}
	Normous._exportPath(name);
};
Normous._implicitNamespaceDictionary = [];

Normous.isNamespace = function(name) {
	return !Normous._implicitNamespaceDictionary[name] && !!Normous.getObjectByName(name);
};

/**
 * Builds an object structure for the provided namespace path,
 * ensuring that names that already exist are not overwritten. For
 * example:
 * "a.b.c" -> a = {};a.b={};a.b.c={};
 * Used by Normous.provide and Normous.exportSymbol.
 * @param {string} name name of the object that this file defines.
 * @param {*=} optObject the object to expose at the end of the path.
 * @param {Object=} optionalObjectToExportTo The object to add the path to; default
 *     is |Normous.global|.
 * @private
 */
Normous._exportPath = function(name, optObject, optionalObjectToExportTo) {
	var parts = name.split('.');
	var cur = optionalObjectToExportTo || Normous.global;
	
	// Internet Explorer exhibits strange behavior when throwing errors from
	// methods externed in this manner.  See the testExportSymbolExceptions in
	// base_test.html for an example.
	if (!(parts[0] in cur) && cur.execScript) {
		cur.execScript('var ' + parts[0]);
	}
	
	// Certain browsers cannot parse code in the form for((a in b); c;);
	// This pattern is produced by the JSCompiler when it collapses the
	// statement above into the conditional loop below. To prevent this from
	// happening, use a for-loop and reserve the init logic as below.

	// Parentheses added to eliminate strict JS warning in Firefox.
	for (var part; parts.length && ( part = parts.shift()); ) {
		if (!parts.length && Normous.Utils.isDefined(optObject)) {
			// last part and we have an object; use it
			cur[part] = optObject;
		} else if (cur[part]) {
			cur = cur[part];
		} else {
			cur = cur[part] = {};
		}
	}
};

Normous.getObjectByName = function(name, optObject) {
	var parts = name.split('.');
	var cur = optObject || Normous.global;
	for (var part; (part = parts.shift()); ) {
		if (Normous.Utils.isDefinedAndNotNull(cur[part])) {
			cur = cur[part];
		} else {
			return null;
		}
	}
	return cur;
};

	
Normous.Utils.typeOf = function(value) {
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
			// we can't use Normous.Utils.isFunction. Calling typeof directly returns 'unknown'
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
Normous.Utils.isDefined = function(val) {
	return val !== undefined;
};

/**
 * Returns true if the specified value is |null|
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is null.
 */
Normous.Utils.isNull = function(val) {
	return val === null;
};

/**
 * Returns true if the specified value is defined and not null
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is defined and not null.
 */
Normous.Utils.isDefinedAndNotNull = function(val) {
	// Note that undefined == null.
	return val != null;
};

/**
 * Returns true if the specified value is an array
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
Normous.Utils.isArray = function(val) {
	return Normous.Utils.typeOf(val) === 'array';
};

/**
 * Returns true if the object looks like an array. To qualify as array like
 * the value needs to be either a NodeList or an object with a Number length
 * property.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
Normous.Utils.isArrayLike = function(val) {
	var type = Normous.Utils.typeOf(val);
	return type === 'array' || type === 'object' && typeof val.length === 'number';
};

/**
 * Returns true if the object looks like a Date. To qualify as Date-like
 * the value needs to be an object and have a getFullYear() function.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a like a Date.
 */
Normous.Utils.isDateLike = function(val) {
	return Normous.Utils.isObject(val) && typeof val.getFullYear === 'function';
};

/**
 * Returns true if the specified value is a string
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a string.
 */
Normous.Utils.isString = function(val) {
	return typeof val === 'string';
};

/**
 * Returns true if the specified value is a boolean
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is boolean.
 */
Normous.Utils.isBoolean = function(val) {
	return typeof val === 'boolean';
};

/**
 * Returns true if the specified value is a number
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a number.
 */
Normous.Utils.isNumber = function(val) {
	return typeof val === 'number';
};

/**
 * Returns true if the specified value is a function
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a function.
 */
Normous.Utils.isFunction = function(val) {
	return Normous.Utils.typeOf(val) === 'function';
};

/**
 * Returns true if the specified value is an object.  This includes arrays
 * and functions.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an object.
 */
Normous.Utils.isObject = function(val) {
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
 * <code>Normous.Utils.cloneObject</code> does not detect reference loops. Objects that
 * refer to themselves will cause infinite recursion.
 *
 * <code>Normous.Utils.cloneObject</code> is unaware of unique identifiers, and copies
 * UIDs created by <code>getUid</code> into cloned results.
 *
 * @param {*} obj The value to clone.
 * @return {*} A clone of the input value.
 * @deprecated Normous.Utils.cloneObject is unsafe. Prefer the Normous.Utils.object methods.
 */
Normous.Utils.cloneObject = function(obj) {
	var type = Normous.Utils.typeOf(obj);
	if (type === 'object' || type === 'array') {
		if (obj.clone) {
			return obj.clone();
		}
		var clone = type === 'array' ? [] : {};
		for (var key in obj) {
			clone[key] = Normous.Utils.cloneObject(obj[key]);
		}
		return clone;
	}

	return obj;
};

/**
 * A native implementation of Normous.Utils.bind.
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
Normous.Utils._bindNative = function(fn, selfObj, var_args) {
	return /** @type {!Function} */(fn.call.apply(fn.bind, arguments));
};

/**
 * A pure-JS implementation of Normous.Utils.bind.
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which |this| should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially
 *     applied to the function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @private
 */
Normous.Utils._bindJavascript = function(fn, selfObj, var_args) {
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
Normous.bind = Normous.Utils.bind = function(fn, selfObj, var_args) {
	// TODO(nicksantos): narrow the type signature.
	if (Function.prototype.bind &&
	// NOTE(nicksantos): Somebody pulled base.js into the default
	// Chrome extension environment. This means that for Chrome extensions,
	// they get the implementation of Function.prototype.bind that
	// calls Normous.Utils.bind instead of the native one. Even worse, we don't want
	// to introduce a circular dependency between Normous.Utils.bind and
	// Function.prototype.bind, so we have to hack this to make sure it
	// works correctly.
	Function.prototype.bind.toString().indexOf('native code') !== -1) {
		Normous.Utils.bind = Normous.Utils._bindNative;
	} else {
		Normous.Utils.bind = Normous.Utils._bindJavascript;
	}
	return Normous.Utils.bind.apply(null, arguments);
};

/**
 * Evals javascript in the global scope.  In IE this uses execScript, other
 * browsers use Normous.global.eval. If Normous.global.eval does not evaluate in the
 * global scope (for example, in Safari), appends a script tag instead.
 * Throws an exception if neither execScript or eval is defined.
 * @param {string} script JavaScript string.
 */
Normous.globalEval = function(script) {
	if (Normous.global.execScript) {
		Normous.global.execScript(script, 'JavaScript');
	} else if (Normous.global.eval) {
		// Test to see if eval works
		if (Normous.Utils._evalWorksForGlobals == null) {
			Normous.global.eval('var _et_ = 1;');
			if ( typeof Normous.global['_et_'] !== 'undefined') {
				delete Normous.global['_et_'];
				Normous.Utils._evalWorksForGlobals = true;
			} else {
				Normous.Utils._evalWorksForGlobals = false;
			}
		}

		if (Normous.Utils._evalWorksForGlobals) {
			Normous.global.eval(script);
		} else {
			var doc = Normous.global.document;
			var scriptElt = doc.createElement('script');
			scriptElt.type = 'text/javascript';
			scriptElt.defer = false;
			// Note(user): can't use .innerHTML since "t('<test>')" will fail and
			// .text doesn't work in Safari 2.  Therefore we append a text node.
			scriptElt.appendChild(doc.createTextNode(script));
			doc.body.appendChild(scriptElt);
			doc.body.removeChild(scriptElt);
		}
	} else {
		throw new Error('Normous.globalEval not available');
	}
};

Normous.extend = function() {
	var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean") {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !Normous.Utils.isFunction(target)) {
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
				if (deep && copy && (Normous.Utils.isObject(copy) || ( copyIsArray = Normous.Utils.isArrayLike(copy)) )) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Normous.Utils.isArrayLike(src) ? src : [];

					} else {
						clone = src && Normous.Utils.isObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = Normous.extend(deep, clone, copy);

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

Normous.Utils.indexOf = function(elem, arr, i) {
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
 * Indicates whether or not we can call 'eval' directly to eval code in the
 * global scope. Set to a Boolean by the first call to Normous.globalEval (which
 * empirically tests whether eval works for globals). @see Normous.globalEval
 * @type {?boolean}
 * @private
 */
Normous.Utils._evalWorksForGlobals = null;



