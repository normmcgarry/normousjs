var BaseObject = require("../BaseObject");
var Utils = require("../Utils");

var BaseEvent = function(config) {
	if(Utils.isString(config)) {
		this.type = config;
	}
	else {
		this._super(config);
	}
};
BaseObject.inherit(BaseEvent, BaseObject);

BaseEvent.prototype.type = null;
BaseEvent.prototype.target = null;
BaseEvent.prototype.bubbles = false;
BaseEvent.prototype.cancelable = false;

module.exports = BaseEvent;