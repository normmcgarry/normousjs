
define([
	'normous/Object', 
	'normous/math/Vector2'
], function() {
    Normous.namespace("Normous.Physics.Vertlet.Constraint");
    
    Normous.Physics.Vertlet.Constraint = function(config) {
        this.parent(config);
    };
    Normous.Object.inherit(Normous.Physics.Vertlet.Constraint, Normous.Object);
    
    Normous.Physics.Vertlet.Constraint.prototype.point1 = null;
    Normous.Physics.Vertlet.Constraint.prototype.point2 = null;
    Normous.Physics.Vertlet.Constraint.prototype.distance = 1;
    Normous.Physics.Vertlet.Constraint.prototype.stiffness = 1;
    Normous.Physics.Vertlet.Constraint.prototype.enabled = true;
    
    Normous.Physics.Vertlet.Constraint.prototype.relax = function(stepCoef) {
        if(!this.enabled) {
            return;
        }
        var normal = this.point1.position.subtract(this.point2.position);
        var m = normal.length2();
		normal.imultiply(((this.distance*this.distance - m)/m)*this.stiffness*stepCoef);
        this.point1.position.iadd(normal);
        this.point2.position.isubtract(normal);
    };
});