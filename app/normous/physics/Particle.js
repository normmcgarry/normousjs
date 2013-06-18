
define([
    'Normous', 'normous/Object', 'normous/math/Vector2'
], function() {
    Normous.namespace("Normous.Physics.Particle");
    
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
    
    Normous.Physics.Particle.prototype.velocity = null;
    Normous.Physics.Particle.prototype.acceleration = null;
    
    Normous.Physics.Particle.prototype.inverseMass = 1/5;
    Normous.Physics.Particle.prototype.damping = 0.99;
    Normous.Physics.Particle.prototype.forceAccumulation = null;
    Normous.Physics.Particle.prototype.fixed = false;
    
    Normous.Physics.Particle.prototype.addForce = function(vector) {
        if(this.fixed) {
            return;
        }
        
        if(vector.x == 0 && vector.y == 0) {
            return;
        }
        
        this.forceAccumulation.iadd(vector);
    };
    
    Normous.Physics.Particle.prototype.velocity = function() {
        var velocity = this.position.subtract(this.previous);
        return velocity;
    };
    
    Normous.Physics.Particle.prototype.integrate  = function(duration) {
        var scaledVelocity = this.velocity.multiply(duration);
        this.position.iadd(scaledVelocity);
        var force = this.forceAccumulation.multiply(this.inverseMass);
        this.acceleration.iadd(force);
        this.acceleration.imultiply(duration);
        this.velocity.iadd(this.acceleration);
        
        this.forceAccumulation.zero(); 
        this.previous = this.position.clone();
    };
    
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