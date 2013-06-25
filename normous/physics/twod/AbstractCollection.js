define([
	'normous/events/EventDispatcher',
	'normous/physics/twod/drawables/CreatejsCollection',
	'normous/physics/twod/CollisionDetector'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.AbstractCollection");
	
	Normous.Physics.Twod.AbstractCollection = function(config) {
		if(config == null) config = {};
		this.drawable = new Normous.Physics.Twod.Drawables.CreatejsCollection({item:this, drawableProperties: config.drawableProperties});
		this.particles = new Array();
		this.constraints = new Array();
		this._super(config);
	};
	Normous.Object.inherit(Normous.Physics.Twod.AbstractCollection, Normous.Events.EventDispatcher);
	
	Normous.Physics.Twod.AbstractCollection.prototype.particles;
	Normous.Physics.Twod.AbstractCollection.prototype.constraints;
	Normous.Physics.Twod.AbstractCollection.prototype.isParented = false;
	Normous.Physics.Twod.AbstractCollection.prototype.drawable;
	Normous.Physics.Twod.AbstractCollection.prototype.parent;
	
	Normous.Physics.Twod.AbstractCollection.prototype.addParticle = function(particle) {
		this.particles.push(particle); 
		particle.parent = this;
		if (this.isParented) {
			particle.init();
		}
		this.drawable.addChild(particle);
	};
	
	Normous.Physics.Twod.AbstractCollection.prototype.removeParticle = function(particle) {
		var index = this.particles.indexOf(particle);
		if(index == -1) {
			return;
		}
		particle.parent = null;
		this.drawable.removeChild(particle);
		this.particles.splice(index, 1);
		particle.cleanup();
	};
	
	Normous.Physics.Twod.AbstractCollection.prototype.addConstraint = function(constraint) {
		var found = false;
		for(var i = this.constraints.length-1; i >= 0; i--) {
   			var c = this.constraints[i];
			if(c.priority > constraint.priority) {
    			continue;
			}
			this.constraints.splice(i,0,constraint);
			found = true;
			break;
		}
		if(!found) {
   			this.constraints.splice(0,0,constraint);
		}
		
		constraint.parent = this;
		if (this.isParented) {
			constraint.init();
		}
		this.drawable.addChild(constraint);
	};
	
	Normous.Physics.Twod.AbstractCollection.prototype.removeConstraint = function(constraint) {
		var index = this.constraints.indexOf(constraint);
		if(index == -1) {
			return;
		}
		constraint.parent = null;
		this.drawable.removeChild(constraint);
		this.constraints.splice(index, 1);
		constraint.cleanup();
	};
	
	Normous.Physics.Twod.AbstractCollection.prototype.cleanup = function() {
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].cleanup();	
		}
		for (i = 0; i < this.constraints.length; i++) {
			this.constraints[i].cleanup();
		}
	};
	
	Normous.Physics.Twod.AbstractCollection.prototype.init = function() {
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].init();    
		}
		for (i = 0; i < this.constraints.length; i++) {
			this.constraints[i].init();
		}
	};
	
	Normous.Physics.Twod.AbstractCollection.prototype.paint = function() {
		var p;
		var len = this.particles.length;
		for (var i = 0; i < len; i++) {
			p = this.particles[i];
			if ((! p.fixed) || p.alwaysRepaint) p.paint();  
		}
		
		var c;
		len = this.constraints.length;
		for (i = 0; i < len; i++) {
			c = this.constraints[i];
			if ((! c.fixed) || c.alwaysRepaint) c.paint();
		}
	};
	
	Normous.Physics.Twod.AbstractCollection.prototype.getAll = function() {
		return this.particles.concat(this.constraints);
	};
	
	Normous.Physics.Twod.AbstractCollection.prototype.integrate = function(dt2) {
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].update(dt2);    
		}
	};
	
	Normous.Physics.Twod.AbstractCollection.prototype.satisfyConstraints = function(stepCoefficient) {
		for (var i = 0; i < this.constraints.length; i++) {
			this.constraints[i].resolve(stepCoefficient);
		}
	};
	
	Normous.Physics.Twod.AbstractCollection.prototype.checkInternalCollisions = function() {
		// every particle in this AbstractCollection
		var plen = this.particles.length;
		for (var j = 0; j < plen; j++) {
			var particle = this.particles[j];
			if (particle == null || ! particle.collidable) continue;
			
			// ...vs every other particle in this AbstractCollection
			for (var i = j + 1; i < plen; i++) {
				var particle2 = this.particles[i];
				if (particle2 != null && particle2.collidable) Normous.Physics.Twod.CollisionDetector.test(particle, particle2);
			}
			
			// ...vs every other constraint in this AbstractCollection
			var clen = this.constraints.length;
			for (var n = 0; n < clen; n++) {
				var c = this.constraints[n];
				if (c != null && c.collidable && ! c.isConnectedTo(particle)) {
					c.scp.updatePosition();
					Normous.Physics.Twod.CollisionDetector.test(particle, c.scp);
				}
			}
		}
	};
	
	
	Normous.Physics.Twod.AbstractCollection.prototype.getAllParticles = function() {
		var all = new Array();
		return all.concat(this.particles);
	};
	
	
	Normous.Physics.Twod.AbstractCollection.prototype.checkCollisionsVsCollection = function(ac) {
		// every particle in this collection...
		var plen = this.particles.length;
		for (var j = 0; j < plen; j++) {
			
			var pga = this.particles[j];
			if (pga == null || ! pga.collidable) continue;
			
			// ...vs every particle in the other collection
			var acplen = ac.particles.length;
			for (var x = 0; x < acplen; x++) {
				var pgb = ac.particles[x];
				if (pgb != null && pgb.collidable) Normous.Physics.Twod.CollisionDetector.test(pga, pgb);
			}
			// ...vs every constraint in the other collection
			var acclen = ac.constraints.length;
			for (x = 0; x < acclen; x++) {
				var cgb = ac.constraints[x];
				if (cgb != null && cgb.collidable && ! cgb.isConnectedTo(pga)) {
					cgb.scp.updatePosition();
					Normous.Physics.Twod.CollisionDetector.test(pga, cgb.scp);
				}
			}
		}
		
		// every constraint in this collection...
		var clen = this.constraints.length;
		for (j = 0; j < clen; j++) {
			var cga = this.constraints[j];
			if (cga == null || ! cga.collidable) continue;
			
			// ...vs every particle in the other collection
			acplen = ac.particles.length;
			for (var n = 0; n < acplen; n++) {
				pgb = ac.particles[n];
				if (pgb != null && pgb.collidable && ! cga.isConnectedTo(pgb)) {
					cga.scp.updatePosition();
					Normous.Physics.Twod.CollisionDetector.test(pgb, cga.scp);
				}
			}
		}
	};
});