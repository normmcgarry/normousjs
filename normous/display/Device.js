define([
    'normous/Normous', 'normous/Object', 'normous/events/EventDispatcher'
], function() {
    /*global Normous:false */
    Normous.namespace("Normous.Display.Device");
    
    
    Normous.Display.Device = function(config) {
        this._super(config);
        this.init();
    };
    Normous.Object.inherit(Normous.Display.Device, Normous.Events.EventDispatcher);
    Normous.Singleton.createSingleton(Normous.Display.Device);
    
    Normous.Display.Device.prototype.body = document.body;
    Normous.Display.Device.prototype.document = document;
    Normous.Display.Device.prototype.window = window;
    
    Normous.Display.Device.ORIENTATION_CHANGE = "orientationchange";
    Normous.Display.Device.MOTION = "devicemotion";
    Normous.Display.Device.LANDSCAPE = "landscape";
    Normous.Display.Device.PORTRAIT = "portrait";
    
    Normous.Display.Device.prototype.init = function() {
        this.window.addEventListener('devicemotion', Normous.bind(this._onDeviceMotion, this), false);
    };
    
    Normous.Display.Device.prototype._onDeviceMotion = function(e) {
        this.dispatchEvent(Normous.Display.Device.MOTION, null, e);
    };
    
    Normous.Display.Device.prototype._onDeviceOrientation = function(e) {
        this.dispatchEvent(Normous.Display.Device.ORIENTATION_CHANGE, null, e);
    };

});