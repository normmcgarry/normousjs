var BaseObject = require("../BaseObject");
var ViewController = require("./ViewController");
var NavigationController = require("./NavigationController");
var ChildCollection = require("./collections/ChildCollection");
var Utils = require("../Utils");
var ViewModelEvent = require("./events/ViewModelEvent");
var AnimationEvent = require("./events/AnimationEvent");
var JQueryViewManager = require("./jquery/ViewManager");

/**
 * NavigationController is a stack of view controllers. The top-most controller is always in view. Handles the events for displaying and hiding ViewControllers.
 * @constructor
 * @extends ViewController
 */
var AnimationController = function(config) {
	this.__onViewFinishedAppearing = Utils.bind(this._onViewFinishedAppearing, this);
	this.__onViewFinishedDisappearing = Utils.bind(this._onViewFinishedDisappearing, this);
	
	this._super(config);
	
	if(this.viewManager == null) {
		this.viewManager = new JQueryViewManager({
			viewController: this
		});
	}
	
	this.viewManager.setCollection(this._children);
	this.viewManager.setView(this.getView());
	this.viewManager.init();
	
	if(this.getRootViewController() != null) {
		this._children.addChild(this._rootViewController);
		this._topViewController = this._rootViewController;
		this._rootViewController.dispatchEvent(new ViewModelEvent(ViewModelEvent.VIEW_DID_APPEAR));
	}
};
BaseObject.inherit(AnimationController, NavigationController);
BaseObject.setRequiredProperties(AnimationController, [
	'rootViewController'
]);

AnimationController.prototype._queuedViewController = null;
AnimationController.prototype._isAnimating = null;

/**
 * @override
 * Push a ViewController to the top of the stack.
 * @param {ViewController} viewController The view controller to push to the top of the stack and make visible.
 */
AnimationController.prototype.pushViewController = function(viewController) {
	if(this._isAnimating) {
		this._queuedViewController = viewController;
		return;
	}
	
	var currentTopViewController = this._topViewController;
	var e = new AnimationEvent(ViewModelEvent.VIEW_WILL_DISAPPEAR);
	currentTopViewController.dispatchEvent(e);
	
	if(e.isCapturingAnimation()) {
		currentTopViewController.addEventListener(AnimationEvent.VIEW_FINISHED_APPEARING, this.__onViewFinishedDisappearing);
		this._queuedViewController = viewController;
		this._isAnimating = true;
		return;
	}
	
	this.addChildViewModel(viewController);
	this._topViewController = viewController;
	
	currentTopViewController.dispatchEvent(new ViewModelEvent(ViewModelEvent.VIEW_DID_DISAPPEAR));
};

/**
 * @override
 * Adds a ViewModel to the stack.
 * @param {ViewModel} childViewModel The ViewModel to add.
 */
AnimationController.prototype.addChildViewModel = function(childViewModel) {
	var e = new AnimationEvent(ViewModelEvent.VIEW_WILL_APPEAR);
	childViewModel.dispatchEvent(e);
	
	if(childViewModel instanceof ViewController) {
		childViewModel._setParentViewController(this);
		childViewModel._setRootViewController(this.getRootViewController());
	}
	
	this._children.addChild(childViewModel);
	
	if(e.isCapturingAnimation()) {
		childViewModel.addEventListener(AnimationEvent.VIEW_FINISHED_APPEARING, this.__onViewFinishedAppearing);
		return;
	}
	else {
		this._isAnimating = false;
	}
	
	childViewModel.dispatchEvent(new ViewModelEvent(ViewModelEvent.VIEW_DID_APPEAR));
};

/**
 * @private
 * AnimationEvent callback when a view finishes disappearing.
 * @param {AnimationEvent} e The AnimationEvent
 */
AnimationController.prototype._onViewFinishedDisappearing = function(e) {
	
	var currentTopViewController = this._topViewController;
	var viewController = this._queuedViewController;
	
	this._queuedViewController = null;
	
	this._topViewController = viewController;
	this.addChildViewModel(viewController);
	
	this._children.removeChild(currentTopViewController);
	
	if(currentTopViewController instanceof ViewController) {
		currentTopViewController._setParentViewController(null);
		currentTopViewController._setRootViewController(null);
	}
	
	currentTopViewController.dispatchEvent(new ViewModelEvent(ViewModelEvent.VIEW_DID_DISAPPEAR));
};

/**
 * @private
 * AnimationEvent callback when a view finishes appearing.
 * @param {AnimationEvent} e The AnimationEvent
 */
AnimationController.prototype._onViewFinishedAppearing = function(e) {
	var childViewModel = this._topViewController;
	childViewModel.dispatchEvent(new ViewModelEvent(ViewModelEvent.VIEW_DID_APPEAR));
	
	this._isAnimating = false;
	if(this._queuedViewController) {
		var viewController = this._queuedViewController;
		this._queuedViewController = null;
		this.pushViewController(viewController);
	}
};

/**
 * @override
 * @inheritDocs
 */
AnimationController.prototype.popViewController = function() {
	if(this.children.length == 1) {
		throw new Error("You cannot pop the rootViewController.");
	}
	
	var currentTopViewController = this._topViewController;
	var newTopViewController = this._children.getChildAt(this._children.length - 1);
	
	var e = new AnimationEvent(ViewModelEvent.VIEW_WILL_DISAPPEAR);
	currentTopViewController.dispatchEvent(e);
	
	if(e.isCapturingAnimation()) {
		currentTopViewController.addEventListener(AnimationEvent.VIEW_FINISHED_APPEARING, this.__onViewFinishedDisappearing);
		this._queuedViewController = newTopViewController;
		this._isAnimating = true;
		return;
	}
	
	newTopViewController.dispatchEvent(new ViewModelEvent(ViewModelEvent.VIEW_WILL_APPEAR));
	
	this.removeChildViewModel(currentTopViewController);
	this._topViewController = newTopViewController;
	newTopViewController.dispatchEvent(new ViewModelEvent(ViewModelEvent.VIEW_DID_APPEAR));
};

/**
 * @override
 * @inheritDocs
 */
AnimationController.prototype.popToRootViewController = function() {
	if(this.children.length == 1) {
		throw new Error("You are on the rootViewController.");
	}
	
	var bottomChild = this._children.getBottomChild();
	var topChild = this._children.getTopChild();
	
	for(var i = this._children.length - 2; i > 0; i--) {
		this._children.removeChildAt(i);
	}
	
	this.popViewController();
};

module.exports = AnimationController;