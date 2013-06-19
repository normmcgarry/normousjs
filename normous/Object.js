define([
    'normous/Normous'
], function() {
    
    /*global Normous:false */
    Normous.namespace("Normous.Object");
        
    Normous.Object = function(config) {
        if(config) {
            this.extend(config);
        }
    };
    
    Normous.Object.prototype.extend = function(config) {
        Normous.extend(this, config);
    };
    
    Normous.Object.prototype.clone = function() {
        var type = Normous.Utils.typeOf(this);
        if (type === 'object' || type === 'array') {
            if (this._parent && this._parent.clone) {
                return this._parent.clone();
            }
            var clone = type === 'array' ? [] : {};
            for (var key in this) {
                if (this[key].clone) {
                    clone[key] = this[key].clone();
                } else {
                    clone[key] = Normous.Utils.cloneObject(this[key]);
                }
            }
            return clone;
        }
        return this;
    };
    
    Normous.Object.inherit = function(childClass, parentClass) {
        var Super = function() {};
        Super.prototype = parentClass.prototype;
        childClass.prototype = new Super();
        childClass._parent = parentClass.prototype;
        childClass.prototype._parent = parentClass.prototype;
        childClass.prototype.constructor = childClass;
    };
    
    Normous.Object.Class = function() {
        return function(config) {
            if(config) {
                this.extend(config);
            }
        };
    };
    
    Normous.Object.prototype.parent = function(methodName, args) {
        var caller = arguments.callee.caller;
        if (caller._parent) {
            // This is a constructor. Call the parentclass constructor.
            return caller._parent.constructor.apply(this, arguments);
        }
        
        var args = Array.prototype.slice.call(arguments, 1);
        var foundCaller = false;
        for (var ctor = this.constructor; ctor; ctor = ctor._parent && ctor._parent.constructor) {
            if (ctor.prototype[methodName] === caller) {
                foundCaller = true;
            } else if (foundCaller) {
                return ctor.prototype[methodName].apply(this, args);
            }
        }
        
        
        // If we did not find the caller in the prototype chain,
        // then one of two things happened:
        // 1) The caller is an instance method.
        // 2) This method was not called by the right caller.
        if (this.constructor && this.constructor._parent && this.constructor._parent[methodName]) {
            return this.constructor._parent[methodName].apply(this, args);
        } else {
            throw new Error('Normous.Object.prototype.parent called from a method of one name ' + 'to a method of a different name');
        }
    };

});