define([
    'normous/Normous', 'normous/Object'
], function() {
    /*global Normous:false */
    Normous.namespace("Normous.Events.EventDispatcher");
    
    Normous.Events.EventDispatcher = function(config) {
        this._listeners = [];
        this._super(config);
    };
    Normous.Object.inherit(Normous.Events.EventDispatcher, Normous.Object);
    
    Normous.Events.EventDispatcher.prototype._listeners = null;
    Normous.Events.EventDispatcher.prototype.addEventListener = function(type, listener) {
        var args = [];
        var numOfArgs = arguments.length;
        for (var i = 0; i < numOfArgs; i++) {
            args.push(arguments[i]);
        }
        args = args.length > 3 ? args.splice(3, args.length - 1) : [];
        if ( typeof this._listeners[type] !== "undefined") {
            this._listeners[type].push({
                listener : listener,
                args : args
            });
        } else {
            this._listeners[type] = [{
                listener : listener,
                args : args
            }]; 
        }
    };
    
    Normous.Events.EventDispatcher.prototype.removeEventListener = function(type, listener) {
        if ( typeof this._listeners[type] !== "undefined") {
            var numOfCallbacks = this._listeners[type].length;
            var newArray = [];
            for (var i = 0; i < numOfCallbacks; i++) {
                var currentListener = this._listeners[type][i];
                if (currentListener.listener === listener) {
                    //do nothing
                } else {
                    newArray.push(listener);
                }
            }
            this._listeners[type] = newArray;
        }
    };
    
    Normous.Events.EventDispatcher.prototype.dispatchEvent = function(type, target) {
		var originalArguments = Normous.extend([], arguments);
		
        var numOfListeners = 0;
        var event = type || {};
        if (Normous.Utils.typeOf(type) === 'string') {
            event = {
                type : type,
                target : target
            };
        }
        type = event.type;
        var args = [];
        var numOfArgs = arguments.length;
        var i;
        for (i = 0; i < numOfArgs; i++) {
            args.push(arguments[i]);
        }
        args = args.length > 2 ? args.splice(2, args.length - 1) : [];
        args = [event].concat(args);
        if ( typeof this._listeners[type] !== "undefined") {
            var numOfCallbacks = this._listeners[type].length;
            for (i = 0; i < numOfCallbacks; i++) {
                var listener = this._listeners[type][i];
                if (listener && listener.listener) {
                    listener.args = args.concat(listener.args);
                    listener.listener.apply(this, listener.args);
                    numOfListeners += 1;
                }
            }
        }
		
		if(event.bubbles && this.parent && this.parent.dispatchEvent) {
			this.parent.dispatchEvent.apply(this.parent, originalArguments);
		}
    };
    
});