
define([
	'normous/Object', 
	'normous/math/Vector2'
], function() {
	
	
	Normous.namespace("Normous.Physics.Vertlet.Simulator");
	
	Normous.Physics.Vertlet.Simulator = function(config) {
		this.composites = [];
		this.constraints = [];
		this.gravity = new Normous.Math.Vector2();
		this.parent(config);
	};
	Normous.Object.inherit(Normous.Physics.Vertlet.Simulator, Normous.Object);
	
	Normous.Physics.Vertlet.Composite.prototype.composites = null;
	Normous.Physics.Vertlet.Composite.prototype.width = 1;
	Normous.Physics.Vertlet.Composite.prototype.height = 1;
	Normous.Physics.Vertlet.Composite.prototype.friction = 0.99;
	Normous.Physics.Vertlet.Composite.prototype.groundFriction = 0.8;
	Normous.Physics.Vertlet.Composite.prototype.gravity = null;
	Normous.Physics.Vertlet.Composite.prototype.steps = 15;
	
	Normous.Physics.Vertlet.Composite.prototype.addComposite = function(composite) {
		this.composites.push(composite);
	};
	
	Normous.Physics.Vertlet.Composite.prototype.update = function(steps) {
		var i, j, c, step;
		
		for (c in this.composites) {
			for (i in this.composites[c].particles) {
				var particles = this.composites[c].particles;
	
				// calculate velocity
				var velocity = particles[i].position.subtract(particles[i].previous).imultiply(this.friction);
	
				// ground friction
				if (particles[i].position.y >= this.height-1 && velocity.length2() > 0.000001) {
					var m = velocity.length();
					velocity.x /= m;
					velocity.y /= m;
					velocity.imultiply(m*this.groundFriction);
				}
	
				// save last good state
				particles[i].previous = particles[i].position;
	
				// gravity
				particles[i].position.iadd(this.gravity);
	
				// inertia  
				particles[i].position.iadd(velocity);
			}
		}
		
		// relax
		var stepCoef = 1/this.steps;
		for (c in this.composites) {
			var constraints = this.composites[c].constraints;
			for (i=0;i<this.steps;++i) {
				for (j in constraints) {
					constraints[j].relax(stepCoef);
				}
			}
		}
		
		for (c in this.composites) {
			var particles = this.composites[c].particles;
			for (i=0;i<this.steps;++i) {
				for (j in constraints) {
					constraints[j].relax(stepCoef);
				}
			}
		}
		

	};
	
	Normous.Physics.Vertlet.Composite.prototype._checkBounds = function(particle) {
		if (particle.pos.y > this.height-1)
			particle.pos.y = this.height-1;

		if (particle.pos.x < 0)
			particle.pos.x = 0;

		if (particle.pos.x > this.width-1)
			particle.pos.x = this.width-1;
	};
	
});