
define([
    'Normous', 'normous/Object', 'normous/math/Vector2'
], function() {
    Normous.namespace("Normous.Physics.Forces.GravityGenerator");

    Normous.Physics.Forces.GravityGenerator = function(config) {
        this.parent(config);
    };
    Normous.Object.inherit(Normous.Physics.Forces.GravityGenerator, Normous.Object);
    
    Normous.Physics.Forces.GravityGenerator.prototype.gravity = new Normous.Math.Vector2(0,0.2);
    
    Normous.Physics.Forces.GravityGenerator.prototype.updateForce = function(particle, duration) {
        if(particle.fixed) {
            return;
        }
        
        var objectForce = this.gravity.multiply(particle.getMass());
        particle.addForce(objectForce);
    };
});