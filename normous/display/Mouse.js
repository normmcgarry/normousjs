define([
    'normous/Normous', 'normous/Object'
], function() {
    /*global Normous:false */
    Normous.namespace("Normous.Display.Mouse");
    
    var Normous.Display.Mouse = function(config) {
        this._super(config);
    };
    Normous.Object.inherit(Normous.Display.Mouse, Normous.Object);
    Normous.Singleton.createSingleton(Normous.Display.Mouse);
    
    Normous.Display.Mouse.prototype.container = document.body;
    
    Normous.Display.Mouse.POINTER = "pointer";
    Normous.Display.Mouse.PROGRESS = "progress";
    Normous.Display.Mouse.AUTO = "auto";
    Normous.Display.Mouse.CROSSHAIR = "crosshair";
    Normous.Display.Mouse.DEFAULT = "default";
    Normous.Display.Mouse.HELP = "help";
    Normous.Display.Mouse.MOVE = "move";
    Normous.Display.Mouse.RESIZE_N = "n-resize";
    Normous.Display.Mouse.RESIZE_E = "e-resize";
    Normous.Display.Mouse.RESIZE_S = "s-resize";
    Normous.Display.Mouse.RESIZE_W = "w-resize";
    Normous.Display.Mouse.RESIZE_NE = "ne-resize";
    Normous.Display.Mouse.RESIZE_NW = "nw-resize";
    Normous.Display.Mouse.RESIZE_SW = "sw-resize";
    Normous.Display.Mouse.RESIZE_SE = "se-resize";
    Normous.Display.Mouse.MOVE = "move";
    Normous.Display.Mouse.TEXT = "text";
    Normous.Display.Mouse.WAIT = "wait";
    Normous.Display.Mouse.INHERIT = "inherit";
    
    Normous.Display.Mouse.prototype.setCursor = function(cursor) {
        this.container.style.cursor = cursor;
    };
});