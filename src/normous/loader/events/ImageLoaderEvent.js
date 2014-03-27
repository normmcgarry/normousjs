var Utils = require("../../Utils");
var BaseObject = require("../../BaseObject"); 
var BaseEvent = require("../../events/BaseEvent");

var ImageLoaderEvent = new BaseObject.InheritedConstructor();
BaseObject.inherit(ImageLoaderEvent,BaseEvent);

ImageLoaderEvent.COMPLETE = 'complete';
ImageLoaderEvent.ITEM_COMPLETE = 'itemComplete';
