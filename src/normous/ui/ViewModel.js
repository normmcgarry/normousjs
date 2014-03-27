var EventDispatcher = require("../events/EventDispatcher");
var BaseObject = require("../BaseObject");


var ViewModel = function(config) {
	this._super(config);
};

BaseObject.inherit(ViewModel, EventDispatcher);

ViewModel.prototype.view = null;

ViewModel.prototype.getView = function() {
	return this.view;
};

ViewModel.prototype.setView = function(element) {
	this.view = element;
};

module.exports = ViewModel;