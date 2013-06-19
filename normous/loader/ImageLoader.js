define([
    'normous/Normous', 'normous/Object', 'normous/events/EventDispatcher', 'normous/Logger'
], function() {
    /*global Normous:false */
    Normous.namespace("Normous.Loader.ImageLoader");
    
    Normous.Loader.ImageLoader = function(config) {
        this._images = [];
        this.parent(config);
        this.init();
    };
    Normous.Object.inherit(Normous.Loader.ImageLoader, Normous.Events.EventDispatcher);
    
    
    Normous.Loader.ImageLoader.COMPLETE = 'complete';
    Normous.Loader.ImageLoader.ITEM_COMPLETE = 'itemComplete';
    
    Normous.Loader.ImageLoader.prototype._images = null;
    Normous.Loader.ImageLoader.prototype.length = 0;
    Normous.Loader.ImageLoader.prototype.numComplete = 0;
    Normous.Loader.ImageLoader.prototype.isLoading = false;
    Normous.Loader.ImageLoader.prototype.isComplete = false;
    Normous.Loader.ImageLoader.prototype.sequentialLoading = false;
    Normous.Loader.ImageLoader.prototype.sequentialLoadingCount = 3;
    
    Normous.Loader.ImageLoader.prototype.init = function() {
        for(var i = 0; i < this._images.length; i++) {
            var img = this._images[i];
            img.addEventListener(Normous.Loader.Image.COMPLETE, Normous.bind(this._onItemComplete, this));
            img.addEventListener(Normous.Loader.Image.ERROR, Normous.bind(this._onItemComplete, this));
            this.length++;
        }
    };
    
    Normous.Loader.ImageLoader.prototype.addImage = function(img) {
        this._images.push(img);
        img.addEventListener(Normous.Loader.Image.COMPLETE, Normous.bind(this._onItemComplete, this));
        img.addEventListener(Normous.Loader.Image.ERROR, Normous.bind(this._onItemComplete, this));
        this.length++;
        
        if(this.isLoading || this.isComplete) {
            this.isLoading = true;
            this.isComplete = false;
            img.load();
        }
    };
    
    Normous.Loader.ImageLoader.prototype.addImages = function(images) {
        for(var i = 0; i < this._images.length; i++) {
            var img = images[i];
            this.addImage(img);
        }
    };
    
    Normous.Loader.ImageLoader.prototype.getItems = function() {
        return this._images;
    };
    
    Normous.Loader.ImageLoader.prototype.getItemAt = function(index) {
        return this._images[index];
    };
    
    Normous.Loader.ImageLoader.prototype.getNumItems = function() {
        return this.length;
    };
    
    Normous.Loader.ImageLoader.prototype.load = function() {
        //Normous.Logger.log("Normous.Loader.ImageLoader.load() " + this._images.length);
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
    
    Normous.Loader.ImageLoader.prototype._onItemComplete = function(e) {
        //Normous.Logger.log("Normous.Loader.Loader.onItemComplete() " + (this.numComplete+1) + " / " + this._images.length);
        this.numComplete++;
        this.dispatchEvent(Normous.Loader.ImageLoader.ITEM_COMPLETE, e.target);
        
        if(this.numComplete === this._images.length) {
            this.isCompleteisComplete = true;
            this.isCompleteisLoading = false;
            this.dispatchEvent(Normous.Loader.ImageLoader.COMPLETE);
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
});