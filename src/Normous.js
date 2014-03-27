var Normous = Normous || {};
var Utils = require("normous/Utils");

Normous.global = this;
Normous.global.Normous = Normous;
Normous.Utils = Utils;

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
 * @inheritDocs
 */
Normous.extend = Utils.extend;

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
		if (!parts.length && Utils.isDefined(optObject)) {
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
		if (Utils.isDefinedAndNotNull(cur[part])) {
			cur = cur[part];
		} else {
			return null;
		}
	}
	return cur;
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
Normous.bind = Normous.Utils.bind;

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
		if (Normous._evalWorksForGlobals == null) {
			Normous.global.eval('var _et_ = 1;');
			if ( typeof Normous.global['_et_'] !== 'undefined') {
				delete Normous.global['_et_'];
				Normous._evalWorksForGlobals = true;
			} else {
				Normous._evalWorksForGlobals = false;
			}
		}

		if (Normous._evalWorksForGlobals) {
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

/**
 * Indicates whether or not we can call 'eval' directly to eval code in the
 * global scope. Set to a Boolean by the first call to globalEval (which
 * empirically tests whether eval works for globals). @see globalEval
 * @type {?boolean}
 * @private
 */
Normous._evalWorksForGlobals = null;

module.exports = Normous;