
define([
    'Normous', 'normous/Object', 'normous/math/Vector2'
], function() {
    Normous.namespace("Normous.Physics.Forces.DampeningGenerator");
    
    Normous.Physics.Forces.DampeningGenerator = function(config) {
        this.parent(config);
    };
    Normous.Object.inherit(Normous.Physics.Forces.DampeningGenerator, Normous.Object);
    
    // holds the velocity drag coefficient
    Normous.Physics.Forces.DampeningGenerator.prototype.dampening = 0.5;
    
    
    Normous.Physics.Forces.DampeningGenerator.prototype.updateForce = function(particle, duration) {
        //impose drag
        var pow = Math.pow(this.dampening, duration);
        particle.velocity.imultiply(pow);
        particle.acceleration.imultiply(pow);
    };
});