
define([
    'normous/Normous', 'normous/Object'
], function() {
    Normous.namespace("Normous.Math.Vector2");
    
    Normous.Math.Vector2 = function(config) {
        this.parent(config);
        if(isNaN(this.x)) 
            this.x = 0;
        if(isNaN(this.y)) 
            this.y = 0;
    };
    Normous.Object.inherit(Normous.Math.Vector2, Normous.Object);
    
    Normous.Math.Vector2.prototype.x = 0;
    Normous.Math.Vector2.prototype.y = 0;
    
    Normous.Math.Vector2.prototype.equals = function(point) {
        return (this.x === point.x && this.y === point.y);
    };
    
    
    Normous.Math.Vector2.prototype.dot = function(point) {
        return this.x * point.x + this.y * point.y;
    };
	
    Normous.Math.Vector2.prototype.cross = function(point) {
        return this.x * point.y + this.y * point.x;
    };
	
    Normous.Math.Vector2.prototype.isubtract = function(point) {
        this.x -= point.x;
        this.y -= point.y;
        return this;
    };
    
    Normous.Math.Vector2.prototype.subtract = function(point) {
        return new Normous.Math.Vector2({
            x: this.x - point.x,
            y: this.y - point.y
        });
    };
    
    Normous.Math.Vector2.prototype.iadd = function(point) {
        this.x += point.x;
        this.y += point.y;
        return this;
    };
    
    Normous.Math.Vector2.prototype.add = function(point) {
        return new Normous.Math.Vector2({
            x: this.x + point.x,
            y: this.y + point.y
        });
    };
    
    Normous.Math.Vector2.prototype.imultiply = function(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    };
    
    Normous.Math.Vector2.prototype.multiply = function(scalar) {
        return new Normous.Math.Vector2({
            x: this.x * scalar,
            y: this.y * scalar
        });
    };
    Normous.Math.Vector2.prototype.idivide = function(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    };
    
    Normous.Math.Vector2.prototype.divide = function(scalar) {
        return new Normous.Math.Vector2({
            x: this.x / scalar,
            y: this.y / scalar
        });
    };
    
    Normous.Math.Vector2.prototype.normalized = function() {
        var x=this.x, y=this.y;
        var length = Math.sqrt(x*x + y*y);
        if(length > 0){
            return new Normous.Math.Vector2({x: x/length, y: y/length});
        }
        return new Normous.Math.Vector2({x: 0, y: 0});
    };
    
    Normous.Math.Vector2.prototype.normalize = function() {
        var x=this.x, y=this.y;
        var length = Math.sqrt(x*x + y*y);
        if(length > 0){
            this.x = x/length;
            this.y = y/length;
        }
        return this;
    };
    
    Normous.Math.Vector2.prototype.length = function() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    };
    
    Normous.Math.Vector2.prototype.length2 = function() {
        return this.x*this.x + this.y*this.y;
    };
    
    Normous.Math.Vector2.prototype.distance = function(point) {
        var x = this.x - point.x;
        var y = this.y - point.y;
        return Math.sqrt(x*x + y*y);
    };
    
    Normous.Math.Vector2.prototype.distance2 = function(point) {
        var x = this.x - point.x;
        var y = this.y - point.y;
        return x*x + y*y;
    };
    
    Normous.Math.Vector2.prototype.clone = function() {
        return new Normous.Math.Vector2({
            x: this.x,
            y: this.y
        });
    };
    
    Normous.Math.Vector2.prototype.zero = function() {
        this.x = 0;
        this.y = 0;
        return this;
    };
    
    Normous.Math.Vector2.prototype.getAngle = function() {
        return (this.x == 0 && this.y == 0) ? 0 : Math.atan2 (this.y,this.x);
    };
    
    Normous.Math.Vector2.prototype.angle = function(v) {
        return Math.atan2(this.x*v.y-this.y*v.x,this.x*v.x+this.y*v.y);
    }
    
    Normous.Math.Vector2.prototype.angle2 = function(vLeft, vRight) {
        return vLeft.subtract(this).angle(vRight.subtract(this));
    };
    
    Normous.Math.Vector2.prototype.setAngle = function(angle) {
        var cosTheta = Math.cos(angle);
        var sinTheta = Math.sin(angle);
        
        var x = this.x * cosTheta - this.y * sinTheta;
        var y = this.x * sinTheta + this.y * cosTheta;
        
        this.x = x;
        this.y = y;
        return this;
    };
    
    Normous.Math.Vector2.prototype.rotate = function(origin, theta) {
        var x = this.x - origin.x;
        var y = this.y - origin.y;
        return new Normous.Math.Vector2({x:x*Math.cos(theta) - y*Math.sin(theta) + origin.x, y:x*Math.sin(theta) + y*Math.cos(theta) + origin.y});
    };
    
    Normous.Math.Vector2.prototype.reset = function(x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    
    Normous.Math.Vector2.prototype.set = function(point) {
        this.x = point.x;
        this.y = point.y;
        return this;
    };
    
    Normous.Math.Vector2.prototype.blend = function(point, percent) {
        if(!percent) percent = 0.5;
        this.x += (point.x - this.x) * percent;
        this.y += (point.y - this.y) * percent;
        return this;
    };
	
    Normous.Math.Vector2.prototype.toString = function() {
		return "{x:" + this.x + ",y:" + this.y + "}";
	};
	
	
});