define([
    'normous/Normous', 'normous/Object'
], function() {
    /*global Normous:false */
    Normous.namespace("Normous.Events.Event");
    
    Normous.Events.Event = function(config) {
        this.parent(config);
    };
    Normous.Object.inherit(Normous.Events.Event, Normous.Object);
    
    Normous.Events.Event.prototype.type = null;
    Normous.Events.Event.prototype.target = null;
    Normous.Events.Event.prototype.bubbles = false;
    Normous.Events.Event.prototype.cancelable = false;
});