var EventDispatcher = require("../events/EventDispatcher");
var ViewModel = require("../ui/ViewModel");
var BaseObject = require("../BaseObject");
var Utils = require("../Utils");


/**
 * This is the abstract version that does nothing. It should be override. 
 * For example, I have created a jQuery version in ./jquery/ViewManager.js.
 * @inheritDocs
 */
var ViewManager = function(config) {
	this._super(config);	
};

BaseObject.inherit(ViewManager, ViewModel);
BaseObject.setRequiredProperties(ViewManager, [
	'viewController'
]);

ViewManager.prototype.viewController = null;

ViewManager.prototype.setViewController = function(viewController) {
	this.viewController = viewController;
};

ViewManager.prototype.getViewController = function() {
	return this.viewController;
};

/**
 * Initializer
 * @protected
 */
ViewManager.prototype.init = function() {
	//should be override with event listeners
};

module.exports = ViewManager;