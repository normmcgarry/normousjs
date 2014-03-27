var BaseObject = require("../BaseObject");
var Utils = require("../Utils");

/**
 * Event dispatcher class that can listen and dispatch events.
 * @inheritDocs
 */
var EventDispatcher = function(config) {
	this._listeners = [];
	this._super(config);
};
BaseObject.inherit(EventDispatcher, BaseObject);

EventDispatcher.prototype._listeners = null;


/**
 * Add an event to the object.
 * @param {String} type, The type of the event. Generally this is stored on a constant.
 * @param {Function} listener The callback function when the event fires.
 */
EventDispatcher.prototype.addEventListener = function(type, listener) {
	var args = [];
	var numOfArgs = arguments.length;
	for (var i = 0; i < numOfArgs; i++) {
		args.push(arguments[i]);
	}
	args = args.length > 3 ? args.splice(3, args.length - 1) : [];
	if ( typeof this._listeners[type] !== "undefined") {
		this._listeners[type].push({
			listener : listener,
			args : args
		});
	} else {
		this._listeners[type] = [{
			listener : listener,
			args : args
		}]; 
	}
};

/**
 * Removes an event.
 * @param {String} type, The type of the event. Generally this is stored on a constant.
 * @param {Function} listener The callback function when the event fires.
 */
EventDispatcher.prototype.removeEventListener = function(type, listener) {
	if ( typeof this._listeners[type] !== "undefined") {
		var numOfCallbacks = this._listeners[type].length;
		var newArray = [];
		for (var i = 0; i < numOfCallbacks; i++) {
			var currentListener = this._listeners[type][i];
			if (currentListener.listener === listener) {
				//do nothing
			} else {
				newArray.push(listener);
			}
		}
		this._listeners[type] = newArray;
	}
};

/**
 * Dispatches the event
 * @param {Event|string} type, The event object or just type of event to fire.
 * @param {Object=} target This is the target object that is passed in the event object. The object that is calling the event.
 */
EventDispatcher.prototype.dispatchEvent = function(type, target) {
	var originalArguments = Utils.extend([], arguments);
	
	var numOfListeners = 0;
	var event = type || {};
	if (Utils.typeOf(type) === 'string') {
		event = {
			type : type,
			target : target
		};
	}
	type = event.type;
	var args = [];
	var numOfArgs = arguments.length;
	var i;
	for (i = 0; i < numOfArgs; i++) {
		args.push(arguments[i]);
	}
	args = args.length > 2 ? args.splice(2, args.length - 1) : [];
	args = [event].concat(args);
	if ( typeof this._listeners[type] !== "undefined") {
		var numOfCallbacks = this._listeners[type].length;
		for (i = 0; i < numOfCallbacks; i++) {
			var listener = this._listeners[type][i];
			if (listener && listener.listener) {
				listener.args = args.concat(listener.args);
				listener.listener.apply(this, listener.args);
				numOfListeners += 1;
			}
		}
	}
	
	if(event.bubbles && this.parent && this.parent.dispatchEvent) {
		this.parent.dispatchEvent.apply(this.parent, originalArguments);
	}
};

module.exports = EventDispatcher;