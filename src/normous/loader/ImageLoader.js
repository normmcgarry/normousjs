var EventDispatcher = require("../events/EventDispatcher");
var BaseObject = require("../BaseObject");
var Utils = require("../Utils");
var ImageLoaderEvent = require("./events/ImageLoaderEvent");

/**
 * Loader that loads an array of {Image}s objects.
 * @constructor
 * @param {object} config Config object that is copied onto the object.
 */
var ImageLoader = function(config) {
	this._images = [];
	this._super(config);
	this.init();
};
BaseObject.inherit(ImageLoader, EventDispatcher);

ImageLoader.prototype._images = null;
ImageLoader.prototype.length = 0;
ImageLoader.prototype.numComplete = 0;
ImageLoader.prototype.isLoading = false;
ImageLoader.prototype.isComplete = false;
ImageLoader.prototype.sequentialLoading = false;
ImageLoader.prototype.sequentialLoadingCount = 3;

/**
 * Initialization that adds the proper events to a prepopulated array that can be optionally passed in.
 */
ImageLoader.prototype.init = function() {
	for(var i = 0; i < this._images.length; i++) {
		var img = this._images[i];
		img.addEventListener(ImageEvent.COMPLETE, Utils.bind(this._onItemComplete, this));
		img.addEventListener(ImageEvent.ERROR, Utils.bind(this._onItemComplete, this));
		this.length++;
	}
};

/**
 * Adds an {Image} to the loader.
 * @param {Image} img The {Image} object to load.
 */
ImageLoader.prototype.addImage = function(img) {
	this._images.push(img);
	img.addEventListener(ImageEvent.COMPLETE, Utils.bind(this._onItemComplete, this));
	img.addEventListener(ImageEvent.ERROR, Utils.bind(this._onItemComplete, this));
	this.length++;
	
	if(this.isLoading || this.isComplete) {
		this.isLoading = true;
		this.isComplete = false;
		img.load();
	}
};

/**
 * Adds an array of {Image}s.
 * @param {Array} images array of {Image}
 */
ImageLoader.prototype.addImages = function(images) {
	for(var i = 0; i < this._images.length; i++) {
		var img = images[i];
		this.addImage(img);
	}
};


/**
 * Returns the array of {Image}s being loaded.
 */
ImageLoader.prototype.getItems = function() {
	return this._images;
};


/**
 * Returns the image at the specified index.
 * @param {number} index The index to return
 * @return {Image} the {Image} to return;
 */
ImageLoader.prototype.getItemAt = function(index) {
	return this._images[index];
};

/**
 * Returns the number of images in the loader.
 * @return {number}
 */
ImageLoader.prototype.getNumItems = function() {
	return this.length;
};

/**
 * Starts the load
 */
ImageLoader.prototype.load = function() {
	if(this.isLoading || this.isComplete) {
		return false;
	}
	
	var i = 0;
	var item = null;
	if(this.sequentialLoading) {
		var numLoading = 0;
		for(i = 0; i < this._images.length; i++) {
			item = this._images[i];
			if(!item.isComplete && !item.isLoading) {
				item.load();
				numLoading++;
			}
			if(numLoading >= this.sequentialLoadingCount) {
				break;
			}
		}
	}
	else {
		for(i = 0; i < this._images.length; i++) {
			item = this._images[i];
			var loading = item.load();
		}
	}
};

/**
 * @private
 * Called when an Image is loaded or errors out. Starts loading the next image in the queue.
 * @param {ImageEvent} e The ImageEvent for the completed item. Can also be an error.
 */
ImageLoader.prototype._onItemComplete = function(e) {
	this.numComplete++;
	this.dispatchEvent(new ImageLoaderEvent(ImageLoaderEvent.ITEM_COMPLETE), e.target);
	
	if(this.numComplete === this._images.length) {
		this.isCompleteisComplete = true;
		this.isCompleteisLoading = false;
		this.dispatchEvent(new ImageLoaderEvent(ImageLoaderEvent.COMPLETE));
		return;
	}
	
	for(var i = 0; i < this._images.length; i++) {
		var item = this._images[i];
		if(!item.isLoading && !item.isComplete) {
			item.load();
			break;
		}
	}
};

module.exports = ImageLoader;