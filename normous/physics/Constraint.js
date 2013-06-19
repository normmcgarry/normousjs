
define([
    'normous/Normous', 'normous/Object', 'normous/math/Vector2'
], function() {
    Normous.namespace("Normous.Physics.Constraint");
    
    Normous.Physics.Constraint = function(config) {
        this.parent(config);
    };
    Normous.Object.inherit(Normous.Physics.Constraint, Normous.Object);
    
    Normous.Physics.Constraint.prototype.point1 = null;
    Normous.Physics.Constraint.prototype.point2 = null;
    Normous.Physics.Constraint.prototype.distance = 1;
    Normous.Physics.Constraint.prototype.stiffness = 1;
    Normous.Physics.Constraint.prototype.enabled = true;
    
    Normous.Physics.Constraint.prototype.relax = function(stepCoef) {
        if(!this.enabled) {
            return;
        }
        var normal = this.point1.position.subtract(this.point2.position);
        var m = normal.length();
        if(m <= this.distance) {
            return;
        }
        m = this.stiffness * (this.distance - m);
        normal.normalize();
        normal.imultiply(-m);
        this.point2.addForce(normal);
        //this.point2.position.iadd(normal);
        //this.point1.position.isubtract(normal);
    };
});