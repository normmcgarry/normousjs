var Utils = require("../../Utils");
var BaseObject = require("../../BaseObject"); 
var BaseEvent = require("../../events/BaseEvent");

var ImageEvent = new BaseObject.InheritedConstructor();
BaseObject.inherit(ImageEvent, BaseEvent);

/** @const */ ImageEvent.COMPLETE = 'imageComplete';
/** @const */ ImageEvent.ABORT = 'abort';
/** @const */ ImageEvent.SRC_CHANGED = 'sourceChanged';
