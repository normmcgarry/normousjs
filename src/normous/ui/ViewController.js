var BaseObject = require("../BaseObject");
var ViewModel = require("./ViewModel");
var ChildCollection = require("./collections/ChildCollection");
var Utils = require("../Utils");

var ViewController = function(config) {
	this._children = new ChildCollection();
	this._super(config);
	this.init();
};
BaseObject.inherit(ViewController, ViewModel);

ViewController.prototype.children = null;
ViewController.prototype._parentViewController = null;
ViewController.prototype._rootViewController = null;
ViewController.prototype._isViewLoaded = null;

ViewController.prototype.init = function() {
	
};

ViewController.prototype.addChildViewModel = function(childViewModel) {
	childViewModel.dispatchEvent(new ViewModelEvent(ViewModelEvent.VIEW_WILL_APPEAR));
	if(childViewModel instanceof ViewController) {
		childViewModel._setParentViewController(this);
		childViewModel._setRootViewController(this.getRootViewController());
	}
	this._children.addChild(childViewModel);
	childViewModel.dispatchEvent(new ViewModelEvent(ViewModelEvent.VIEW_DID_APPEAR));
};

ViewController.prototype.addChildViewModelAt = function(childViewModel, index) {
	childViewModel.dispatchEvent(new ViewModelEvent(ViewModelEvent.VIEW_WILL_APPEAR));
	if(childViewModel instanceof ViewController) {
		childViewModel._setParentViewController(this);
		childViewModel._setRootViewController(this.getRootViewController());
	}
	this._children.addChildAt(childViewModel, index);
	childViewModel.dispatchEvent(new ViewModelEvent(ViewModelEvent.VIEW_DID_APPEAR));
};

ViewController.prototype.removeChildViewModel = function(childViewModel) {
	if(!this._children.containsChild(childViewModel)) {
		throw new Error("Child does not exist in the child collection.");
	}
	childViewModel.dispatchEvent(new ViewModelEvent(ViewModelEvent.VIEW_WILL_DISAPPEAR));
	this._children.removeChild(childViewModel);
	
	if(childViewModel instanceof ViewController) {
		childViewModel._setParentViewController(null);
		childViewModel._setRootViewController(null);
	}
	
	childViewModel.dispatchEvent(new ViewModelEvent(ViewModelEvent.VIEW_DID_DISAPPEAR));
};

ViewController.prototype.removeChildViewModelAt = function(index) {
	var childViewModel = this._children.getChildAt(index);
	this.removeChildViewModel(childViewModel);
};

ViewController.prototype.getChildren = function() {
	return this._children;
};

ViewController.prototype._setParentViewController = function(parentViewController) {
	this._parentViewController = parentViewController;
};

ViewController.prototype._setRootViewController = function(rootViewController) {
	if(rootViewController == null) {
		rootViewController = this;
	}
	
	this._rootViewController = rootViewController;
	
	for(var i = 0; i < this._children.length; i++) {
		var child = this._children.getChildAt(i);
		if(child instanceof ViewController) {
			child._setRootViewController(rootViewController);
		}
	}
};

ViewController.prototype.getParentViewController = function() {
	return this._parentViewController;
};

ViewController.prototype.getRootViewController = function() {
	return this._rootViewController;
};

ViewController.prototype.loadView = function() {
	//this is abstract
};

ViewController.prototype.isViewLoaded = function() {
	return this._isViewLoaded;
};
 
module.exports = ViewController;