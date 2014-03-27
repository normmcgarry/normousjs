var Utils = require("../../Utils");
var BaseObject = require("../../BaseObject"); 
var BaseEvent = require("../../events/BaseEvent");

/**
 * Events for the ViewModel object
 * @constructor
 * @extends Event
 */
var ChildEvent = function(config) {
	this._super(config);
};
BaseObject.inherit(ChildEvent, BaseEvent);

ChildEvent.prototype.child = null;
ChildEvent.prototype.index = null;

ChildEvent.prototype.setChild = function(child) {
	this.child = child;
};

ChildEvent.prototype.getChild = function() {
	return this.child;
};

ChildEvent.prototype.setIndex = function(index) {
	this.index = index;
};

ChildEvent.prototype.getIndex = function() {
	return this.index;
};

/**
 * Event fired before the view appears in the ViewController.
 * @const
 * @type {string}
 */
ChildEvent.CHILD_ADDED = 'childAdded';

/**
 * Event fired after the view appeared in the ViewController.
 * @const
 * @type {string}
 */
ChildEvent.CHILD_REMOVED = 'childRemoved';


module.exports = ChildEvent;