
define([
	'normous/Object', 
	'normous/math/Vector2'
], function() {
	
	
	Normous.namespace("Normous.Physics.Vertlet.Simulator");
	
	Normous.Physics.Vertlet.Simulator = function(config) {
		this.composites = [];
		this.constraints = [];
		this.gravity = new Normous.Math.Vector2({x: 0, y: 0.2});
		this.parent(config);
	};
	Normous.Object.inherit(Normous.Physics.Vertlet.Simulator, Normous.Object);
	
	Normous.Physics.Vertlet.Simulator.prototype.composites = null;
	Normous.Physics.Vertlet.Simulator.prototype.width = 1;
	Normous.Physics.Vertlet.Simulator.prototype.height = 1;
	Normous.Physics.Vertlet.Simulator.prototype.friction = 0;
	Normous.Physics.Vertlet.Simulator.prototype.groundFriction = 0;
	Normous.Physics.Vertlet.Simulator.prototype.gravity = null;
	Normous.Physics.Vertlet.Simulator.prototype.steps = 15;
	Normous.Physics.Vertlet.Simulator.prototype.lastTime = (window.performance && window.performance.now) ? window.performance.now() : new Date().getTime();
	
	Normous.Physics.Vertlet.Simulator.prototype.addComposite = function(composite) {
		Normous.Logger.log(composite);
		this.composites.push(composite);
	};
	
	Normous.Physics.Vertlet.Simulator.prototype.removeComposite = function(composite) {
		var index = this.composites.indexOf(composite);
		if(index != -1) {
			this.composites.splice(index, 1);
		}
	};
	
	Normous.Physics.Vertlet.Simulator.prototype.update = function() {
		var now = window.performance.now();
		var fps = 1000/(now - this.lastTime);
		this.lastTime = now;
		
		var i, j, c, step;
		var stepCoef = 1/this.steps;
		
		for (c = 0; c < this.composites.length; c++) {
			var composite = this.composites[c];
			for (i = 0; i < composite.particles.length; i++) {
				var particle = composite.particles[i];
				particle.integrate(stepCoef);
			}
		}
		
		for (c = 0; c < this.composites.length; c++) {
			this.composites[c].update();
		}

		// relax
		for (c = 0; c < this.composites.length; c++) {
			var constraints = this.composites[c].constraints;
			for (i = 0; i < this.steps; i++) {
				for (j = 0; j < constraints.length; j++) {
					constraints[j].relax(stepCoef);
				}
			}
		}
		
		for (c = 0; c < this.composites.length; c++) {
			var particles = this.composites[c].particles;
			for (i = 0; i < particles.length; i++) {
				this._checkBounds(particles[i]);
			}
		}
		
	};
	
	Normous.Physics.Vertlet.Simulator.prototype._checkBounds = function(particle) {
		if (particle.position.y > this.height-1)
			particle.position.y = this.height-1;

		if (particle.position.x < 0)
			particle.position.x = 0;

		if (particle.position.x > this.width-1)
			particle.position.x = this.width-1;
	};
	
});