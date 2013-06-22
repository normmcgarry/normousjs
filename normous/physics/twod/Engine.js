define([
	'normous/events/EventDispatcher',
	'normous/physics/twod/drawables/CreatejsCollection',
	'normous/Singleton'
], function() {
	
	
	
	Normous.namespace("Normous.Physics.Twod.Engine");
	
	Normous.Physics.Twod.Engine = function() {
		this.drawable = new Normous.Physics.Twod.Drawables.CreatejsCollection({item:this});
		this.container = this.drawable.element;
		this.parent({});
	};
	Normous.Object.inherit(Normous.Physics.Twod.Engine, Normous.Events.EventDispatcher);
	Normous.Singleton.createSingleton(Normous.Physics.Twod.Engine);
	
	Normous.Physics.Twod.Engine.forces = new Array();
	
	Normous.Physics.Twod.Engine.prototype.init = function(dt) {
		this.timeStep = dt * dt;
		
		this.numGroups = 0;
		this.groups = new Array();
		this.forces = new Array();
		
		Normous.Physics.Twod.Engine.damping = 0.89;
		this.constraintCycles = 1;
		this.constraintCollisionCycles = 30;
	};
	
	Normous.Physics.Twod.Engine.prototype.addForce = function(force) {
		Normous.Physics.Twod.Engine.forces.push(force);
	};
	
	Normous.Physics.Twod.Engine.prototype.removeForce = function(force) {
		var index = Normous.Physics.Twod.Engine.forces.indexOf(force);
		if(index != -1) {
			Normous.Physics.Twod.Engine.forces.splice(index, 1);
		}
	};
	
	Normous.Physics.Twod.Engine.prototype.removeForces = function() {
		Normous.Physics.Twod.Engine.forces = new Array();
	};
	
	Normous.Physics.Twod.Engine.prototype.getAllParticles = function() {
		var all = new Array();
		for(var i = 0; i < this.groups.length; i++) {
			all = all.concat(this.groups[i].getAllParticles());
		}
		return all;
	};
	
	Normous.Physics.Twod.Engine.prototype.addGroup = function(group) {
		this.groups.push(group);
		this.numGroups++;
		group.isParented = true;
		this.drawable.addChild(group);
		group.init();
	};
	
	Normous.Physics.Twod.Engine.prototype.removeGroup = function(group) {
		var index = this.groups.indexOf(group);
		if(index == -1) {
			return;
		}
		this.groups.splice(index, 1);
		this.drawable.removeChild(group);
		group.isParented = false;
		this.numGroups--;
		group.cleanup();
	};
	
	Normous.Physics.Twod.Engine.prototype.update = function() {
		this.integrate();
		for(var j = 0; j < this.constraintCycles; j++) {
			this.satisfyConstraints();	
		}
		for(var i = 0; i < this.constraintCollisionCycles; i++) {
			this.satisfyConstraints();
			this.checkCollisions();
		}
	};
	
	Normous.Physics.Twod.Engine.prototype.integrate = function() {
		for(var j = 0; j < this.numGroups; j++) {
			var group = this.groups[j];
			group.integrate(this.timeStep);
		}
	};
	
	Normous.Physics.Twod.Engine.prototype.satisfyConstraints = function() {
		for(var j = 0; j < this.numGroups; j++) {
			var group = this.groups[j];
			group.satisfyConstraints();
		}
	};
	
	Normous.Physics.Twod.Engine.prototype.checkCollisions = function() {
		for(var j = 0; j < this.groups.length; j++) {
			var group = this.groups[j];
			group.checkCollisions();
		}
	};
	
	Normous.Physics.Twod.Engine.prototype.paint = function() {
		for(var j = 0; j < this.groups.length; j++) {
			var group = this.groups[j];
			group.paint();
		}
	};
});