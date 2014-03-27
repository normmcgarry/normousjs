var BaseObject = require("./Object");

var Singleton = function() {};
BaseObject.inherit(Singleton, BaseObject);

Singleton._instances = [];

/**
 * Creates a singleton object on the object.
 * @param {Object} ChildClass The Object to make a singleton.
 */
Singleton.createSingleton = function(ChildClass) {
	ChildClass.getInstance = function() {
		if(ChildClass._instance == null) {
			ChildClass._instance = new ChildClass();
		}
		return ChildClass._instance;
	};
};

module.exports = Singleton;