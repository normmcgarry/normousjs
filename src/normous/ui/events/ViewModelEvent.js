var Utils = require("../../Utils");
var BaseObject = require("../../BaseObject"); 
var BaseEvent = require("../../events/BaseEvent");

/**
 * Events for the ViewModel object
 * @constructor
 * @extends Event
 */
var ViewModelEvent = new BaseObject.InheritedConstructor();
BaseObject.inherit(ViewModelEvent, BaseEvent);

/**
 * Event fired before the view appears in the ViewController.
 * @const
 * @type {string}
 */
ViewModelEvent.VIEW_WILL_APPEAR = 'viewWillAppear';
/**
 * Event fired after the view appeared in the ViewController.
 * @const
 * @type {string}
 */
ViewModelEvent.VIEW_DID_APPEAR = 'viewDidAppear';
/**
 * Event fired before the view is removed/hidden in the ViewController.
 * @const
 * @type {string}
 */
ViewModelEvent.VIEW_WILL_DISAPPEAR = 'viewWillDisappear';
/**
 * Event fired after the view is removed/hidden in the ViewController.
 * @const
 * @type {string}
 */
ViewModelEvent.VIEW_DID_DISAPPEAR = 'viewDidDisappear';
/**
 * Event fired after the view is loaded by the ViewController.
 * @const
 * @type {string}
 */
ViewModelEvent.VIEW_DID_LOAD = 'viewDidLoad';

module.exports = ViewModelEvent;