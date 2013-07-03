define([
	'normous/physics/twod/AbstractCollection'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.Group");
	
	Normous.Physics.Twod.Group = function(config) {
		this.composites = new Array();
		this.collisionList = new Array();
		this._super(config);
	};
	
	Normous.Object.inherit(Normous.Physics.Twod.Group, Normous.Physics.Twod.AbstractCollection);
	
	Normous.Physics.Twod.Group.prototype.composites;
	Normous.Physics.Twod.Group.prototype.collisionList;
	Normous.Physics.Twod.Group.prototype.collideInternal = false;
	
	
	Normous.Physics.Twod.Group.prototype.init = function() {
		this._super('init');
		for(var i = 0; i < this.composites.length; i++) {
			this.composites[i].init();
		}
	};
	
	Normous.Physics.Twod.Group.prototype.addComposite = function(composite) {		
		this.composites.push(composite);
		composite.isParented = true;
		composite.parent = this;
		if(this.isParented) composite.init();
		this.drawable.addChild(composite);
		
		var e = new Normous.Physics.Twod.EngineEvent({
   			type: Normous.Physics.Twod.EngineEvent.COMPOSITE_ADDED,
			element: particle
		});
		this.dispatchEvent(e);
	};
	
	Normous.Physics.Twod.Group.prototype.removeComposite = function(composite) {
		var index = this.composites.indexOf(composite);
		if(index == -1) return;
		this.drawable.removeChild(composite);
		this.composites.splice(index, 1);
		composite.parent = null;
		composite.isParented = false;
		composite.cleanup();
		
		var e = new Normous.Physics.Twod.EngineEvent({
   			type: Normous.Physics.Twod.EngineEvent.COMPOSITE_REMOVED,
			element: particle
		});
		this.dispatchEvent(e);
	};
	
	Normous.Physics.Twod.Group.prototype.paint = function() {
		this._super('paint');
		for(var i = 0; i < this.composites.length; i++) {
			this.composites[i].paint();
		}
	};
	
	Normous.Physics.Twod.Group.prototype.addCollidable = function(collidable) {
		this.collisionList.push(collidable);
	};
	
	Normous.Physics.Twod.Group.prototype.removeCollidable = function(collidable) {
		var index = this.collisionList.indexOf(collidable);
		if(index == -1) return;
		this.collisionList.splice(index, 1);
	};
	
	Normous.Physics.Twod.Group.prototype.addCollidableList = function(collidables) {
		for(var i = 0; i < collidables.length; i++) {
			var collidable = collidables[i];
			this.collisionList.push(collidable);
		}
	};
	
	Normous.Physics.Twod.Group.prototype.getAll = function() {
		return this.partciles.concat(this.constraints).concat(this.composites);
	};
	
	Normous.Physics.Twod.Group.prototype.getAllParticles = function() {
		var all = new Array();
		all = all.concat(this.particles);
		for(var i = 0; i < this.composites.length; i++) {
			all = all.concat(this.composites[i].getAllParticles());
		}
		return all;
	};
	
	Normous.Physics.Twod.Group.prototype.cleanup = function() {
		this._super('cleanup');
		for (var i = 0; i < this.composites.length; i++) {
			this.composites[i].cleanup();   
		}
	};
	
	Normous.Physics.Twod.Group.prototype.integrate = function(dt2) {
		this._super('integrate', dt2);
		for (var i = 0; i < this.composites.length; i++) {
			this.composites[i].integrate(dt2);
		}
	};
	
	Normous.Physics.Twod.Group.prototype.satisfyConstraints = function(stepCoefficient) {
		this._super('satisfyConstraints', stepCoefficient);
		for (var i = 0; i < this.composites.length; i++) {
			this.composites[i].satisfyConstraints(stepCoefficient);
		}
	};
	
	Normous.Physics.Twod.Group.prototype.checkCollisions = function() {
		
		if(this.collideInternal) {
			this.checkCollisionGroupInternal();
		}
		
		for (var i = 0; i < this.collisionList.length; i++) {
			var g = this.collisionList[i];
			if(g == null) continue;
			this.checkCollisionVsGroup(g);
		}
	};
	
	
	Normous.Physics.Twod.Group.prototype.checkCollisionGroupInternal = function() {
		// check collisions not in composites
		this.checkInternalCollisions();
		
		// for every composite in this Group..
		var clen = this.composites.length;
		for (var j = 0; j < clen; j++) {
			
			var ca = this.composites[j];
			if (ca == null) continue;
			
			ca.checkInternalCollisions();
			// .. vs non composite particles and constraints in this group
			ca.checkCollisionsVsCollection(this);
			
			// ...vs every other composite in this Group
			for (var i = j + 1; i < clen; i++) {
				var cb = this.composites[i];
				if (cb != null) ca.checkCollisionsVsCollection(cb);
			}
		}
	}
		
	Normous.Physics.Twod.Group.prototype.checkCollisionVsGroup = function(g) {
		
		// check particles and constraints not in composites of either group
		this.checkCollisionsVsCollection(g);
		
		var gc;
		var clen = this.composites.length;
		var gclen = g.composites.length;
		
		// for every composite in this group..
		for (var i = 0; i < clen; i++) {
			// check vs the particles and constraints of g
			var c = this.composites[i];
			if (c == null) continue;
			c.checkCollisionsVsCollection(g);
			
			// check vs composites of g
			for (var j = 0; j < gclen; j++) {
				gc = g.composites[j];
				if (gc == null) continue;
				c.checkCollisionsVsCollection(gc);
			}
		}
		
		// check particles and constraints of this group vs the composites of g
		for (j = 0; j < gclen; j++) {
			gc = g.composites[j];
			if (gc == null) continue;       
			this.checkCollisionsVsCollection(gc);
		}
	}
		
	
	Normous.Physics.Twod.Group.prototype.serialize = function() {
		var obj = this._super('serialize');
		obj.composites = [];
		obj.collisionList = [];
		
		for(var i = 0; i < this.composites.length; i++) {
			var composite = this.composites[i];
			obj.composites.push(composite.serialize());
		}
		
		for(var i = 0; i < this.collisionList.length; i++) {
			var collidable = this.collisionList[i];
			obj.collisionList.push(collidable.id);
		}
		
		return obj;
	};
	
	Normous.Physics.Twod.Group.prototype.unserialize = function(obj) {
		this._super('unserialize', obj);
		
		for(var i = 0; i < obj.composites.length; i++) {
			var c = obj.composites[i];
			var composite = Normous.Physics.Twod.GlobalCollection.getCompositeById(c.id);
			composite.unserialize(c);
		}
		
		this.collisionList = new Array();
		
		for(var i = 0; i < obj.collisionList.length; i++) {
			var g = obj.collisionList[i];
			var group = Normous.Physics.Twod.GlobalCollection.getGroupById(g);
			this.collisionList.push(group);
		}
	};
	
	Normous.Physics.Twod.Group.prototype.create = function(obj) {
		this._super('create', obj);
		
		for(var i = 0; i < obj.composites.length; i++) {
			var c = obj.composites[i];
			var composite = new Normous.Physics.Twod.Composite();
			composite.create(c);
			this.addComposite(composite);
		}
	};
		
});