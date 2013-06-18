
define([
    'Normous', 'normous/Object', 'normous/math/Vector2'
], function() {
    Normous.namespace("Normous.Physics.Forces.DragForceGenerator");

    Normous.Physics.Forces.DragForceGenerator = function(config) {
        this.parent(config);
    };
    Normous.Object.inherit(Normous.Physics.Forces.DragForceGenerator, Normous.Object);
    
    // holds the velocity drag coefficient
    Normous.Physics.Forces.DragForceGenerator.prototype.k1 = 0;
    // holds the velocity squared drag coefficient
    Normous.Physics.Forces.DragForceGenerator.prototype.k2 = 0;
    
    
    Normous.Physics.Forces.DragForceGenerator.prototype.updateForce = function(particle, duration) {
        var velocity = particle.velocity;
        var dragCoeff = velocity.length();
        dragCoeff = this.k1 * dragCoeff + this.k2 * dragCoeff * dragCoeff;
        
        velocity.normalize();
        velocity.imultiply(-dragCoeff);
        particle.addForce(velocity);
    };
});