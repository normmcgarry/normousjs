
define([
    'Normous', 'normous/Object', 'normous/math/Vector2'
], function() {
    Normous.namespace("Normous.Physics.VertletConstraint");

    Normous.Physics.VertletConstraint = function(config) {
        this.parent(config);
    };
    Normous.Object.inherit(Normous.Physics.VertletConstraint, Normous.Object);
    
    Normous.Physics.VertletConstraint.prototype.point1 = null;
    Normous.Physics.VertletConstraint.prototype.point2 = null;
    Normous.Physics.VertletConstraint.prototype.distance = 1;
    Normous.Physics.VertletConstraint.prototype.stiffness = 1;
    Normous.Physics.VertletConstraint.prototype.enabled = true;
    
    Normous.Physics.VertletConstraint.prototype.relax = function(stepCoef) {
        if(!this.enabled) {
            return;
        }
        var normal = this.point1.position.subtract(this.point2.position);
        var m = normal.length2();
        
        normal.imultiply(((this.distance * this.distance - m) / m) * this.stiffness * stepCoef);
        
        this.point2.position.iadd(normal);
        this.point1.position.isubtract(normal);
    };
});