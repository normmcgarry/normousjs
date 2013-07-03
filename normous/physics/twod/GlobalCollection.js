define([
	'normous/Object'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.GlobalCollection");
	
	Normous.Physics.Twod.GlobalCollection.particles = {};
	Normous.Physics.Twod.GlobalCollection.constraints = {};
	Normous.Physics.Twod.GlobalCollection.groups = {};
	Normous.Physics.Twod.GlobalCollection.composites = {};
	
	Normous.Physics.Twod.GlobalCollection.addParticle = function(particle) {
		Normous.Physics.Twod.GlobalCollection.particles[particle.id] = particle;
	};
	
	Normous.Physics.Twod.GlobalCollection.removeParticle = function(particle) {
		delete Normous.Physics.Twod.GlobalCollection.particles[particle.id];
	};
	
	Normous.Physics.Twod.GlobalCollection.addConstraint = function(constraint) {
		Normous.Physics.Twod.GlobalCollection.constraints[constraint.id] = constraint;
	};
	
	Normous.Physics.Twod.GlobalCollection.removeConstraint = function(constraint) {
		delete Normous.Physics.Twod.GlobalCollection.constraints[constraint.id];
	};
	
	Normous.Physics.Twod.GlobalCollection.addGroup = function(group) {
		Normous.Physics.Twod.GlobalCollection.groups[group.id] = group;
	};
	
	Normous.Physics.Twod.GlobalCollection.removeGroup = function(group) {
		delete Normous.Physics.Twod.GlobalCollection.groups[group.id];
	};
	
	Normous.Physics.Twod.GlobalCollection.addComposite = function(composite) {
		Normous.Physics.Twod.GlobalCollection.composites[composite.id] = composite;
	};
	
	Normous.Physics.Twod.GlobalCollection.removeComposite = function(id) {
		delete Normous.Physics.Twod.GlobalCollection.composites[id];
	};
	
	Normous.Physics.Twod.GlobalCollection.getCompositeById = function(id) {
		return Normous.Physics.Twod.GlobalCollection.composites[id];
	};
	
	Normous.Physics.Twod.GlobalCollection.getGroupById = function(id) {
		return Normous.Physics.Twod.GlobalCollection.groups[id];
	};
	
	Normous.Physics.Twod.GlobalCollection.getParticleById = function(id) {
		return Normous.Physics.Twod.GlobalCollection.particles[id];
	};
	
	Normous.Physics.Twod.GlobalCollection.getConstraintById = function(id) {
		return Normous.Physics.Twod.GlobalCollection.constraints[id];
	};
	
	Normous.Physics.Twod.GlobalCollection.getById = function(id) {
		if(Normous.Physics.Twod.GlobalCollection.constraints[id]) {
			return Normous.Physics.Twod.GlobalCollection.constraints[id];
		}
		else if(Normous.Physics.Twod.GlobalCollection.particles[id]) {
			return Normous.Physics.Twod.GlobalCollection.particles[id];
		}
		else if(Normous.Physics.Twod.GlobalCollection.groups[id]) {
			return Normous.Physics.Twod.GlobalCollection.groups[id];
		}
		else if(Normous.Physics.Twod.GlobalCollection.composites[id]) {
			return Normous.Physics.Twod.GlobalCollection.composites[id];
		}
		else {
			return null;
		}
	};
	
});