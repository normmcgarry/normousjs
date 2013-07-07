define([
	'normous/events/EventDispatcher',
	'normous/physics/twod/drawables/CreatejsCollection',
	'normous/physics/twod/GlobalCollection',
	'normous/physics/twod/GlobalForces',
	'normous/Singleton'
], function() {
	
	
	
	Normous.namespace("Normous.Physics.Twod.Engine");
	
	Normous.Physics.Twod.Engine = function() {
		this.drawable = new Normous.Physics.Twod.Drawables.CreatejsCollection({item:this});
		this.container = this.drawable.element;
		this._super({});
	};
	Normous.Object.inherit(Normous.Physics.Twod.Engine, Normous.Events.EventDispatcher);
	Normous.Singleton.createSingleton(Normous.Physics.Twod.Engine);
	
	Normous.Physics.Twod.Engine.forces = new Array();
	
	Normous.Physics.Twod.Engine.prototype.worker = null;
	
	Normous.Physics.Twod.Engine.prototype.init = function(dt) {
		this.timeStep = dt * dt;
		
		this.numGroups = 0;
		this.groups = new Array();
		this.forces = new Array();
		
		this.constraintCycles = 1;
		this.constraintCollisionCycles = 30;
	};
	
	Normous.Physics.Twod.Engine.prototype.addForce = function(force) {
		Normous.Physics.Twod.GlobalForces.addForce(force);
	};
	
	Normous.Physics.Twod.Engine.prototype.removeForce = function(force) {
		Normous.Physics.Twod.GlobalForces.removeForce(force);
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
		group.parent = this;
		group.init();
		Normous.Physics.Twod.GlobalCollection.addGroup(group);
		var e = new Normous.Physics.Twod.EngineEvent({
   			type: Normous.Physics.Twod.EngineEvent.GROUP_ADDED,
			element: group
		});
		this.dispatchEvent(e);
		
	};
	
	Normous.Physics.Twod.Engine.prototype.removeGroup = function(group) {
		var index = this.groups.indexOf(group);
		if(index == -1) {
			return;
		}
		this.groups.splice(index, 1);
		this.drawable.removeChild(group);
		group.isParented = false;
		group.parent = null;
		this.numGroups--;
		group.cleanup();
		var e = new Normous.Physics.Twod.EngineEvent({
   			type: Normous.Physics.Twod.EngineEvent.GROUP_REMOVED,
			element: group
		});
		this.dispatchEvent(e);
	};
	
	Normous.Physics.Twod.Engine.prototype.update = function() {
		if(this.worker) {
			//this.worker.synchronize();
			return;
		}
		
		this.integrate();
		for(var j = 0; j < this.constraintCycles; j++) {
			this.satisfyConstraints(1 / (this.constraintCycles));	
		}
		for(var i = 0; i < this.constraintCollisionCycles; i++) {
			this.satisfyConstraints(1 / (this.constraintCollisionCycles));
			this.checkCollisions();
		}
	};
	
	Normous.Physics.Twod.Engine.prototype.integrate = function() {
		for(var j = 0; j < this.numGroups; j++) {
			var group = this.groups[j];
			group.integrate(this.timeStep);
		}
	};
	
	Normous.Physics.Twod.Engine.prototype.satisfyConstraints = function(stepCoefficient) {
		for(var j = 0; j < this.numGroups; j++) {
			var group = this.groups[j];
			group.satisfyConstraints(stepCoefficient);
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
	
	Normous.Physics.Twod.Engine.prototype.serialize = function() {
		var obj = {};
		obj.groups = [];
		
		for(var i = 0; i < this.groups.length; i++) {
			var group = this.groups[i];
			var g = group.serialize();
			obj.groups.push(g);
		}
		
		return obj;
	};
	
	Normous.Physics.Twod.Engine.prototype.unserialize = function(obj) {
		for(var i = 0; i < obj.groups.length; i++) {
			var g = obj.groups[i];
			var group = Normous.Physics.Twod.GlobalCollection.getGroupById(g.id);
			group.unserialize(g);
		}
	};
	
});