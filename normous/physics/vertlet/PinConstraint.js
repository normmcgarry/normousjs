
define([
	'normous/Object', 
	'normous/math/Vector2'
], function() {
    Normous.namespace("Normous.Physics.Vertlet.PinConstraint");
    
    Normous.Physics.Vertlet.PinConstraint = function(config) {
        this.parent(config);
    };
    Normous.Object.inherit(Normous.Physics.Vertlet.PinConstraint, Normous.Object);
    
    Normous.Physics.Vertlet.PinConstraint.prototype.point1 = null;
    Normous.Physics.Vertlet.PinConstraint.prototype.position = null;
    Normous.Physics.Vertlet.PinConstraint.prototype.distance = 1;
    Normous.Physics.Vertlet.PinConstraint.prototype.stiffness = 1;
    Normous.Physics.Vertlet.PinConstraint.prototype.enabled = true;
    
    Normous.Physics.Vertlet.PinConstraint.prototype.relax = function(stepCoef) {
        if(!this.enabled) {
            return;
        }
        var normal = this.point1.position.subtract(this.point2.position);
        var m = normal.length2();
		normal.imultiply(((this.distance*this.distance - m)/m)*this.stiffness*stepCoef);
        this.point1.position.iadd(normal);
    };
});