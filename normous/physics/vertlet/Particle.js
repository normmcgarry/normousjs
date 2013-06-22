
define([
	'normous/Object', 
	'normous/math/Vector2'
], function() {
    Normous.namespace("Normous.Physics.Vertlet.Particle");
    
    Normous.Physics.Vertlet.Particle = function(config) {
        this.parent(config);
		if(this.position == null) {
			this.position = new Normous.Math.Vector2(config);
		}
		if(this.previous == null) {
			this.previous = this.position.clone();
		}
        if(this.mass) {
            this.setMass(this.mass);
			this.mass = null;
        }
    };
    Normous.Object.inherit(Normous.Physics.Vertlet.Particle, Normous.Object);
    
    Normous.Physics.Vertlet.Particle.prototype.position = null;
	
   	Normous.Physics.Vertlet.Particle.prototype.velocity = new Normous.Math.Vector2();
   	Normous.Physics.Vertlet.Particle.prototype.acceleration = new Normous.Math.Vector2
   	Normous.Physics.Vertlet.Particle.prototype.force = new Normous.Math.Vector2();
    
    Normous.Physics.Vertlet.Particle.prototype.inverseMass = 1/5;
    Normous.Physics.Vertlet.Particle.prototype.damping = 0.99;
    Normous.Physics.Vertlet.Particle.prototype.fixed = false;
    
    Normous.Physics.Vertlet.Particle.prototype.setMass = function(mass) {
        if(mass === 0) {
            throw new Error("Mass cannot be zero!");
        }
        this.inverseMass = 1/mass;
    };
	
    Normous.Physics.Vertlet.Particle.prototype.getMass = function() {
        if(this.inverseMass === 0) {
            return Math.max;
        }
        return 1 / this.inverseMass;
    };
	
    Normous.Physics.Vertlet.Particle.prototype.integrate = function(delta) {
		this.velocity.imultiply(delta)
		this.position.iadd(this.velocity);
		
		this.force.imultiply(this.inverseMass);
		this.acceleration.iadd(this.force);
		
		var acceleration = this.acceleration.multiply(delta);
		this.velocity.iadd(acceleration);
		
		this.velocity.imultiply(Math.pow(this.damping, delta));
		this.force.zero();
    };
	
    Normous.Physics.Vertlet.Particle.prototype.addForce = function(force) {
		this.force.iadd(force);
	};
	
	Normous.Physics.Vertlet.Particle.prototype.toString = function() {
		return "{Particle " + this.position + "}";
	};
});