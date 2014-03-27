var EventDispatcher = require("../../events/EventDispatcher");
var ViewModel = require("../../ui/ViewModel");
var BaseObject = require("../../BaseObject");
var Utils = require("../../Utils");
var ViewManager = require("../ViewManager");
var ChildEvent = require("../events/ChildEvent");

/**
 * This ViewManager handles the implementation of adding and removing children from the ViewController when jQuery is used.
 * @inheritDocs
 */
var JQueryViewManager = function(config) {
	this._super(config);
	
	this.__onChildAdded = Utils.bind(this._onChildAdded, this);
	this.__onChildRemoved = Utils.bind(this._onChildRemoved, this);
	
	this.collection = this.viewController.getChildren();
	if(this.viewController.getView() == null) {
		this.viewController.setView(this.view);
	}
};

BaseObject.inherit(JQueryViewManager, ViewManager);

/**
 * @protected
 * Adds listeners and initialize the ViewManager.
 */
JQueryViewManager.prototype.init = function() {
	this.collection.addEventListener(ChildEvent.CHILD_ADDED, this.__onChildAdded);
	this.collection.addEventListener(ChildEvent.CHILD_REMOVED, this.__onChildRemoved);
};

/**
 * @private
 * When a child is added to the view controller, add it to the jQuery view.
 * @param {ChildEvent} e The CHILD_ADDED event.
 */
JQueryViewManager.prototype._onChildAdded = function(e) {
	var child = e.getChild();
	var view = child.getView();
	this.viewController.getView().append(view);
};

/**
 * @private
 * When a child is removed from the view controller, remove it from the jQuery view.
 * @param {ChildEvent} e The CHILD_REMOVED event.
 */
JQueryViewManager.prototype._onChildRemoved = function(e) {
	e.getChild().getView().remove();
};

module.exports = JQueryViewManager;