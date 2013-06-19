define([
    'normous/Normous', 'normous/Object', 'normous/mvc/ViewModel',
], function() {
    /*global Normous:false */
    Normous.namespace("Normous.Loader.Image");
    
    Normous.Loader.Image = function(config) {
        this.element = new Image();
        this.parent(config);
        this.init();
    };
    Normous.Object.inherit(Normous.Loader.Image, Normous.Mvc.ViewModel);
    
    Normous.Loader.Image.COMPLETE = 'imageComplete';
    Normous.Loader.Image.ABORT = 'abort';
    Normous.Loader.Image.SRC_CHANGED = 'sourceChanged';
    
    Normous.Loader.Image.prototype.src = null;
    Normous.Loader.Image.prototype.isLoading = false;
    Normous.Loader.Image.prototype.isComplete = false;
    Normous.Loader.Image.prototype.autoload = false;
    
    Normous.Loader.Image.prototype.init = function() {
        this.setElement(this.element);
        if(this.autoload) {
            this.load();
        }
    };
    
    Normous.Loader.Image.prototype.setElement = function(element) {
        Normous.Logger.log("Normous.Loader.Image.setElement() " + this.getSrc());
        this.element.onload = null;
        this.element.onerror = null;
        this.element.onabort = null;
        this.isLoading = false;
        this.element = element;
        this.element.onload = Normous.bind(this._onImageComplete, this);
        this.element.onerror = Normous.bind(this._onImageError, this);
        this.element.onabort = Normous.bind(this._onImageAbort, this);
        
        if(this.element.complete && this.element.src !== "") {
            this.isComplete = true;
            this.dispatchEvent(Normous.Loader.Image.COMPLETE, this);
        }
    };
    
    Normous.Loader.Image.prototype.load = function() {
        //Normous.Logger.log("Normous.Loader.Image.load() " + this.getSrc());
        if(this.isComplete) {
            this._onImageComplete();
            return;
        }
        this.isLoading = true;
        this.element.src = this.getSrc();
    };
    
    Normous.Loader.Image.prototype.setSrc = function(src) {
        if(this.src !== src) {
            this.src = src;
            if(this.isLoading) {
                load();
            }
            this.dispatchEvent(Normous.Loader.Image.SRC_CHANGED, this);
        }
    };
    
    Normous.Loader.Image.prototype.getSrc = function() {
        return this.src;
    };
    
    Normous.Loader.Image.prototype._onImageComplete = function() {
        //Normous.Logger.log("Normous.Loader.Image._onImageComplete() " + this.getSrc());
        this.isLoading = false;
        this.isComplete = true;
        this.dispatchEvent(Normous.Loader.Image.COMPLETE, this);
    };
    
    Normous.Loader.Image.prototype._onImageError = function() {
        Normous.Logger.log("Normous.Loader.Image._onImageError() " + this.getSrc());
        this.isLoading = false;
        this.dispatchEvent(Normous.Loader.Image.ERROR, this);
    };
    
    Normous.Loader.Image.prototype._onImageAbort = function() {
        this.isLoading = false;
        this.dispatchEvent(Normous.Loader.Image.ABORT, this);
    };
    
});