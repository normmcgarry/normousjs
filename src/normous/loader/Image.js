var Utils = require("../Utils");
var BaseObject = require("../BaseObject"); 
var ViewModel = require("../ui/ViewModel");
var Logger = require("../Logger");
var ImageEvent = require("./events/ImageEvent");

/**
 * Image ViewModel that loads an image.
 * @constructor
 * @param {type} config Config object copied onto the object.
 * @extends {ViewModel}
 * @inheritDocs
 */
var Image = function(config) {
	this.element = new Image();
	this._super(config);
	this.init();
};
BaseObject.inherit(Image, ViewModel);
BaseObject.setRequiredProperties(Image, [
	'src'
]);

Image.prototype.src = null;
Image.prototype.isLoading = false;
Image.prototype.isComplete = false;
Image.prototype.autoload = false;

/**
 * Starts the load if set to autoload. Sets up the ViewModel.
 */
Image.prototype.init = function() {
	this.setElement(this.element);
	if(this.autoload) {
		this.load();
	}
};

/**
 * Description
 * @param {type} element Description
 */
Image.prototype.setElement = function(element) {
	Logger.log("Image.setElement() " + this.getSrc());
	this.element.onload = null;
	this.element.onerror = null;
	this.element.onabort = null;
	this.isLoading = false;
	this.element = element;
	this.element.onload = Utils.bind(this._onImageComplete, this);
	this.element.onerror = Utils.bind(this._onImageError, this);
	this.element.onabort = Utils.bind(this._onImageAbort, this);
	
	if(this.element.complete && this.element.src !== "") {
		this.isComplete = true;
		this.dispatchEvent(new ImageEvent(ImageEvent.COMPLETE), this);
	}
};

/**
 * Starts the load
 */
Image.prototype.load = function() {
	if(this.isComplete) {
		this._onImageComplete();
		return;
	}
	this.isLoading = true;
	this.element.src = this.getSrc();
};

/**
 * Changes the src attribute of the image.
 * @param {string} src The source path to load the image.
 */
Image.prototype.setSrc = function(src) {
	if(this.src !== src) {
		this.src = src;
		if(this.isLoading) {
			load();
		}
		this.dispatchEvent(new ImageEvent(ImageEvent.SRC_CHANGED), this);
	}
};


/**
 * Returns the source element.
 * @return {string} The source of the element.
 */
Image.prototype.getSrc = function() {
	return this.src;
};


/**
 * @private
 * Called when the image load is complete.
 */
Image.prototype._onImageComplete = function() {
	this.isLoading = false;
	this.isComplete = true;
	this.dispatchEvent(Image.COMPLETE, this);
};


/**
 * @private
 * Called when the image load errors.
 */
Image.prototype._onImageError = function() {
	Logger.log("Image._onImageError() " + this.getSrc());
	this.isLoading = false;
	this.dispatchEvent(new ImageEvent(ImageEvent.ERROR), this);
};


/**
 * @private
 * Called when the load is stopped.
 */
Image.prototype._onImageAbort = function() {
	this.isLoading = false;
	this.dispatchEvent(new ImageEvent(ImageEvent.ABORT), this);
};

module.exports = Image;