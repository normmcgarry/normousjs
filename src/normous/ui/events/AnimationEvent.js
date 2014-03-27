var Utils = require("../../Utils");
var BaseObject = require("../../BaseObject"); 
var BaseEvent = require("../../events/BaseEvent");

/**
 * Events for the ViewModel object
 * @constructor
 * @extends Event
 */
var AnimationEvent = function(config) {
	this._super(config);
};
BaseObject.inherit(AnimationEvent, BaseEvent);

/**
 * Event fired before the view appears in the ViewController.
 * @const
 * @type {string}
 */
AnimationEvent.VIEW_FINISHED_APPEARING = 'viewFinishedAppearing';
/**
 * Event fired after the view appeared in the ViewController.
 * @const
 * @type {string}
 */
AnimationEvent.VIEW_FINISHED_DISAPPEARING = 'viewFinishedDisappearing';


AnimationEvent.prototype.capturingAnimation = false;

AnimationEvent.prototype.setCapturingAnimation = function(capturingAnimation) {
	this.capturingAnimation = capturingAnimation;
};

AnimationEvent.prototype.getCapturingAnimation = function() {
	return this.capturingAnimation;
};

AnimationEvent.prototype.isCapturingAnimation = function() {
	return this.capturingAnimation;
};

AnimationEvent.prototype.captureAnimation = function() {
	this.capturingAnimation = true;
};



module.exports = AnimationEvent;