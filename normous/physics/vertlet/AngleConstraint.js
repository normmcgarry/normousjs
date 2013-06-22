
define([
	'normous/Object', 
	'normous/math/Vector2'
], function() {
    Normous.namespace("Normous.Physics.Vertlet.AngleConstraint");
    
    Normous.Physics.Vertlet.AngleConstraint = function(config) {
        this.parent(config);
    };
    Normous.Object.inherit(Normous.Physics.Vertlet.AngleConstraint, Normous.Object);
    
    Normous.Physics.Vertlet.AngleConstraint.prototype.point1 = null;
    Normous.Physics.Vertlet.AngleConstraint.prototype.point2 = null;
    Normous.Physics.Vertlet.AngleConstraint.prototype.point3 = null;
    Normous.Physics.Vertlet.AngleConstraint.prototype.angle = 45;
    Normous.Physics.Vertlet.AngleConstraint.prototype.stiffness = 1;
    Normous.Physics.Vertlet.AngleConstraint.prototype.enabled = true;
    
    Normous.Physics.Vertlet.AngleConstraint.prototype.relax = function(stepCoef) {
		var angle = this.point2.position.angle2(this.point1.position, this.point3.position);
		var diff = angle - this.angle;
	
		if (diff <= -Math.PI)
			diff += 2*Math.PI;
		else if (diff >= Math.PI)
			diff -= 2*Math.PI;
	
		diff *= stepCoef*this.stiffness;
	
		this.point1.position = this.point1.position.rotate(this.point2.position, diff);
		this.point3.position = this.point3.position.rotate(this.point2.position, -diff);
		this.point2.position = this.point2.position.rotate(this.point1.position, diff);
		this.point2.position = this.point2.position.rotate(this.point3.position, -diff);
    };
	
	Normous.Physics.Vertlet.AngleConstraint.prototype.toString = function() {
		return "{AngleConstraint}";
	};
	
});