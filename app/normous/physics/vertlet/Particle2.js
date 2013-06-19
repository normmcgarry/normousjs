
define([
	'normous/Object', 
	'normous/math/Vector2'
], function() {
    Normous.namespace("Normous.Physics.Vertlet.Particle2");
    
    Normous.Physics.Particle = function(config) {
        this.parent(config);
        this.position = new Normous.Math.Vector2(config);
        this.previous = new Normous.Math.Vector2(config);
        this.forceAccumulation = new Normous.Math.Vector2();
        this.velocity = new Normous.Math.Vector2();
        this.acceleration = new Normous.Math.Vector2();
        
        if(this.mass) {
            this.setMass(this.mass);
        }
    };
    Normous.Object.inherit(Normous.Physics.Particle, Normous.Object);
    
    Normous.Physics.Particle.prototype.position = null;
    Normous.Physics.Particle.prototype.previous = null;
    
    Normous.Physics.Particle.prototype.inverseMass = 1/5;
    Normous.Physics.Particle.prototype.fixed = false;
    
    Normous.Physics.Particle.prototype.setMass = function(mass) {
        if(mass === 0) {
            throw new Error("Mass cannot be zero!");
        }
        this.inverseMass = 1/mass;
    };
    Normous.Physics.Particle.prototype.getMass = function() {
        if(this.inverseMass === 0) {
            return Math.max;
        }
        return 1 / this.inverseMass;
    };
});