
define([
	'normous/Object', 
	'normous/math/Vector2'
], function() {
    Normous.namespace("Normous.Physics.Vertlet.Constraint");
    
    Normous.Physics.Vertlet.Constraint = function(config) {
        this.parent(config);
		if(this.distance == null) {
			this.distance = this.point1.position.subtract(this.point2.position).length();
		}
    };
    Normous.Object.inherit(Normous.Physics.Vertlet.Constraint, Normous.Object);
    
    Normous.Physics.Vertlet.Constraint.prototype.point1 = null;
    Normous.Physics.Vertlet.Constraint.prototype.point2 = null;
    Normous.Physics.Vertlet.Constraint.prototype.distance = null;
    Normous.Physics.Vertlet.Constraint.prototype.stiffness = 1;
    Normous.Physics.Vertlet.Constraint.prototype.enabled = true;
    
    Normous.Physics.Vertlet.Constraint.prototype.relax = function(stepCoef) {
        if(!this.enabled) {
            return;
        }
        var normal = this.point1.position.subtract(this.point2.position);
        var m = normal.length();
		m = Math.abs(m - this.distance);
		m *= this.stiffness;
		normal.normalize();
		normal.imultiply(-m);
		this.point1.addForce(normal);
    };
	
	Normous.Physics.Vertlet.Constraint.prototype.toString = function() {
		return "{Constraint}";
	};
	
});