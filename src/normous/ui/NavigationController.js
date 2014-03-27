var BaseObject = require("../BaseObject");
var ViewController = require("./ViewController");
var ChildCollection = require("./collections/ChildCollection");
var Utils = require("../Utils");
var ViewModelEvent = require("./events/ViewModelEvent");

/**
 * NavigationController is a stack of view controllers. The top-most controller is always in view. Handles the events for displaying and hiding ViewControllers.
 * @constructor
 * @extends ViewController
 */
var NavigationController = function(config) {
	this._super(config);
	this._rootViewController = this.rootViewController;
	delete this.rootViewController;
	this._topViewController = this._rootViewController;
};
BaseObject.inherit(NavigationController, ViewController);
BaseObject.setRequiredProperties(NavigationController, [
	'rootViewController'
]);

NavigationController.prototype._topViewController = null;


/**

 * Push a ViewController to the top of the stack.

 * @param {ViewController} viewController The view controller to push to the top of the stack and make visible.

 */

NavigationController.prototype.pushViewController = function(viewController) {
	var currentTopViewController = this._topViewController;
	currentTopViewController.dispatchEvent(new ViewModelEvent(ViewModelEvent.VIEW_WILL_DISAPPEAR));
	
	this.addChildViewModel(viewController);
	this._topViewController = viewController;
	
	currentTopViewController.dispatchEvent(new ViewModelEvent(ViewModelEvent.VIEW_DID_DISAPPEAR));
};


/**
 * Remove the top ViewController. Will automatically display the next ViewController in the stack.
 */

NavigationController.prototype.popViewController = function() {
	if(this.children.length == 1) {
		throw new Error("You cannot pop the rootViewController.");
	}
	var currentTopViewController = this._topViewController;
	var newTopViewController = this._children.getChildAt(this._children.length - 1);
	newTopViewController.dispatchEvent(new ViewModelEvent(ViewModelEvent.VIEW_WILL_APPEAR));
	this.removeChildViewModel(currentTopViewController);
	this._topViewController = newTopViewController;
	newTopViewController.dispatchEvent(new ViewModelEvent(ViewModelEvent.VIEW_DID_APPEAR));
};


/**

 * Returns the top ViewController in the stack.
 
 * @return {ViewController} The top ViewController.

 */

NavigationController.prototype.getTopViewController = function() {
	return this._topViewController;
};


/**

 * Pops all ViewControllers up to the rootViewController.

 */

NavigationController.prototype.popToRootViewController = function() {
	var bottomChild = this._children.getBottomChild();
	
	for(var i = this._children.length - 1; i > 0; i--) {
		var child = this._children.getChildAt(i);
		child.dispatchEvent(new ViewModelEvent(ViewModelEvent.VIEW_WILL_DISAPPEAR));
		if(i == 1) {
			bottomChild.dispatchEvent(new ViewModelEvent(ViewModelEvent.VIEW_WILL_APPEAR));
		}
		this.removeChildViewModel(currentTopViewController);
		child.dispatchEvent(new ViewModelEvent(ViewModelEvent.VIEW_DID_DISAPPEAR));
	}
	this._topViewController = bottomChild;
	bottomChild.dispatchEvent(new ViewModelEvent(ViewModelEvent.VIEW_DID_APPEAR));
};

module.exports = NavigationController;