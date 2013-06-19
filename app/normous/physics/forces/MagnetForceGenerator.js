
define([
    'normous/Normous', 'normous/Object', 'normous/math/Vector2'
], function() {
    Normous.namespace("Normous.Physics.Forces.MagnetForceGenerator");

    Normous.Physics.Forces.MagnetForceGenerator = function(config) {
        this.parent(config);
    };
    Normous.Object.inherit(Normous.Physics.Forces.MagnetForceGenerator, Normous.Object);
    
    // holds the velocity drag coefficient
    Normous.Physics.Forces.MagnetForceGenerator.prototype.radius = 40;
    Normous.Physics.Forces.MagnetForceGenerator.prototype.magnetParticle = null;
    Normous.Physics.Forces.MagnetForceGenerator.prototype.strength = 10;
    
    
    Normous.Physics.Forces.MagnetForceGenerator.prototype.updateForce = function(particle, duration) {
        var normal = particle.position.subtract(this.magnetParticle.position);
        var m = normal.length();
        if(m < this.radius) {
            
            m = this.strength * m;
            normal.normalize();
            normal.imultiply(-m);
            
            particle.addForce(normal);
        }
        
    };
});