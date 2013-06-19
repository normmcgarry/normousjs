
define([
	'normous/Object', 
	'normous/math/Vector2'
], function() {
	
	
	Normous.namespace("Normous.Physics.Vertlet.Composite");
	
	Normous.Physics.Vertlet.Composite = function(config) {
		this.particles = [];
		this.constraints = [];
		this.parent(config);
	});
	Normous.Object.inherit(Normous.Physics.Vertlet.Composite, Normous.Object);
	
	Normous.Physics.Vertlet.Composite.prototype.particles = null;
	Normous.Physics.Vertlet.Composite.prototype.constraints = null;
	
	Normous.Physics.Vertlet.Composite.prototype.addParticle = function(particle) {
		this.particles.push(particle);
	};
	
	Normous.Physics.Vertlet.Composite.prototype.addConstraint = function(constraint) {
		this.constraints.push(constraint);
	};
	
});