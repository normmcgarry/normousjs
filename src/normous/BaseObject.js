var Utils = require("./Utils");
var ArgumentError = require("./exceptions/ArgumentError");

/**
 * A base class with some nice helper methods.
 * @param {Object=} config A config object that gets copied onto the object. (optional)
 */
var BaseObject = function(config) {
	
	if(config) {
		this.extend(config);
	}
	if(Utils.isDefinedAndNotNull(this.required)) {
		for(var i = 0; i < this.required.length; i++) {
			var required = this.required[i];
			if(Utils.isString(required)) {
				if(!Utils.isDefined(this[required])) {
					throw new ArgumentError("Missing a required field: " + required);
				}
			}
			else {
				throw new ArgumentError("The required property should be an array of strings.");
			}
		}
	}
};

/**
 * A simple extend method that will copy an object onto the scope object.
 * @param {Object} config The object to copy
 */
BaseObject.prototype.extend = function(config) {
	Utils.extend(this, config);
};


/**
 * Returns a deep clone, as best possible.
 * @return {Object}
 */
BaseObject.prototype.clone = function() {
	var type = Utils.typeOf(this);
	if (type === 'object' || type === 'array') {
		if (this._parent && this._parent.clone) {
			return this._parent.clone();
		}
		var clone = type === 'array' ? [] : {};
		for (var key in this) {
			if (this[key].clone) {
				clone[key] = this[key].clone();
			} else {
				clone[key] = Utils.cloneObject(this[key]);
			}
		}
		return clone;
	}
	return this;
};


/**
 * A static method for inheriting from another class.
 * @param {Object} childClass, The child class that will inherit from parentClass.
 * @param {Object} parentClass The parent class which the childClass will be inheriting.
 */
BaseObject.inherit = function(childClass, parentClass) {
	var Super = function() {};
	Super.prototype = parentClass.prototype;
	childClass.prototype = new Super();
	childClass._parent = parentClass.prototype;
	childClass.prototype._parent = parentClass.prototype;
	childClass.prototype.constructor = childClass;
};


/**
 * Required properties are properties that are required into the "config" object that is passed in. Will throw an exception if any are missing on the object. Will inherit required properties from parent classes when this method is used.
 * @param {Object} ChildClass, The class to set required properties.
 * @param {Array} required Array of required properties as strings.
 */
BaseObject.setRequiredProperties = function(ChildClass, required) {
	if(Utils.isDefinedAndNotNull(ChildClass.prototype.required)) {
		Utils.extend(ChildClass.prototype.required, required);
	}
	else {
		ChildClass.prototype.required = required;
	}
};


/**
 * A default constrcutor that can be used if you don't want to write one.
 * @return {Function} a Default constructor for the BaseObject.
 * @deprecated Use DefaultConstructor
 */
BaseObject.Class = function() {
	return function(config) {
		if(config) {
			this.extend(config);
		}
	};
};


/**
 * A default constructor when using a inherited class. Will call the super and inherit from parent class.
 * @return {Function} a Default constructor for the BaseObject.
 * @deprecated Use InheritedConstructor
 */
BaseObject.ChildClass = function() {
	return function(config) {
		this._super(config);
	};
};

/**
 * A default constrcutor that can be used if you don't want to write one.
 * @return {Function} a Default constructor for the BaseObject.
 */
BaseObject.DefaultConstructor = function() {
	return function(config) {
		if(config) {
			this.extend(config);
		}
	};
};

/**
 * A default constructor when using a inherited class. Will call the super and inherit from parent class.
 * @return {Function} a Default constructor for the BaseObject.
 */
BaseObject.InheritedConstructor = function() {
	return function(config) {
		this._super(config);
	};
};


/**
 * @protected
 * Calls the parent class method
 * @param {String} methodName, The method name of what to call.
 * @param {Array} args Array-like structure to pass as arguments
 */
BaseObject.prototype._super = function(methodName, args) {
	var caller = arguments.callee.caller;
	if (caller._parent) {
		// This is a constructor. Call the parentclass constructor.
		return caller._parent.constructor.apply(this, arguments);
	}
	
	var args = Array.prototype.slice.call(arguments, 1);
	var foundCaller = false;
	for (var ctor = this.constructor; ctor; ctor = ctor._parent && ctor._parent.constructor) {
		if (ctor.prototype[methodName] === caller) {
			foundCaller = true;
		} else if (foundCaller) {
			return ctor.prototype[methodName].apply(this, args);
		}
	}
	
	
	// If we did not find the caller in the prototype chain,
	// then one of two things happened:
	// 1) The caller is an instance method.
	// 2) This method was not called by the right caller.
	if (this.constructor && this.constructor._parent && this.constructor._parent[methodName]) {
		return this.constructor._parent[methodName].apply(this, args);
	} else {
		throw new Error('BaseObject.prototype.parent called from a method of one name ' + 'to a method of a different name');
	}
};

module.exports = BaseObject;