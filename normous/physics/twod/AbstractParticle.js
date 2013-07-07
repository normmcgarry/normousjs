define([
	'normous/Object',
	'normous/physics/twod/AbstractItem',
	'normous/physics/twod/Interval',
	'normous/physics/twod/Collision',
	'normous/physics/twod/CollisionEvent',
	'normous/physics/twod/ForceEvent',
	'normous/physics/twod/EngineSynchronizer',
	'normous/physics/twod/GlobalForces'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.AbstractParticle");
	
	Normous.Physics.Twod.AbstractParticle = function(config) {
		this.position = new Normous.Math.Vector2();
		this.previous = this.position.clone();
		this.sample = new Normous.Math.Vector2();
		this._temp = new Normous.Math.Vector2();
		this._center = new Normous.Math.Vector2();
		this.fixed = false;
		
		this.accumulatedForce = new Normous.Math.Vector2();
		this.forces = new Array();
		
		this.interval = new Normous.Physics.Twod.Interval({min:0, max:0});
		
		this.collision = new Normous.Physics.Twod.Collision({
			vn: new Normous.Math.Vector2(), 
			vx: new Normous.Math.Vector2()
		});
		
		this._super(config);
		this.previous = this.position.clone();
		
		if(config.x) {
			this.position.x = config.x;
			this.previous.x = config.x;
		}
		
		if(config.y) {
			this.position.y = config.y;
			this.previous.y = config.y;
		}
		
		if(this.mass) {
			this.setMass(this.mass);
		}
		
		if(this.drawable) {
			this.drawable.init();
		}
	};
	
	Normous.Object.inherit(Normous.Physics.Twod.AbstractParticle, Normous.Physics.Twod.AbstractItem);
	
	/** @type Vector2 */
	Normous.Physics.Twod.AbstractParticle.prototype.position;
	/** @type Vector2 */
	Normous.Physics.Twod.AbstractParticle.prototype.previous;
	
	/** @type Vector2 */
	Normous.Physics.Twod.AbstractParticle.prototype.sample;
	/** @type Interval */
	Normous.Physics.Twod.AbstractParticle.prototype.interval;
	/** @type Interval */
	Normous.Physics.Twod.AbstractParticle.prototype.parent;
	
	
	/** @type Vector2 */
	Normous.Physics.Twod.AbstractParticle.prototype._temp;
	/** @type Vector2 */
	Normous.Physics.Twod.AbstractParticle.prototype.accumulatedForce;
	/** @type Array */
	Normous.Physics.Twod.AbstractParticle.prototype.forces;
	/** @type Collision */
	Normous.Physics.Twod.AbstractParticle.prototype.collision;
	/** @type Boolean */
	Normous.Physics.Twod.AbstractParticle.prototype.firstCollision = false;
	
	/** @type Boolean */
	Normous.Physics.Twod.AbstractParticle.prototype.collidable = true;
	
	
	/** @type Number */
	Normous.Physics.Twod.AbstractParticle.prototype._mass = 1;
	/** @type Number */
	Normous.Physics.Twod.AbstractParticle.prototype._inverseMass = 1;
	/** @type Number */
	Normous.Physics.Twod.AbstractParticle.prototype.elasticity = 0.3;
	/** @type Number */
	Normous.Physics.Twod.AbstractParticle.prototype.friction = 0.5;
	
	/** @type Vector2 */
	Normous.Physics.Twod.AbstractParticle.prototype._center;
	
	/** @type Number */
	Normous.Physics.Twod.AbstractParticle.prototype._multisample = 0;
	
	Normous.Physics.Twod.AbstractParticle.prototype.setMass = function(mass) {
		this._mass = mass;
		this._inverseMass = 1/mass;
	};
	
	Normous.Physics.Twod.AbstractParticle.prototype.getMass = function() {
		return this._mass;
	};
	
	Normous.Physics.Twod.AbstractParticle.prototype.getCenter = function() {
		this._center.reset(this.position.x, this.position.y);
		return this._center;
	};
	
	Normous.Physics.Twod.AbstractParticle.prototype.setPosition = function(position) {
		this.previous = position.clone();
		this.position = position.clone();
	};
	
	Normous.Physics.Twod.AbstractParticle.prototype.getPosition = function() {
		return new Normous.Math.Vector2({x: this.position.x, y: this.position.y});
	};
	
	Normous.Physics.Twod.AbstractParticle.prototype.getX = function() {
		return this.position.x;
	};
	
	Normous.Physics.Twod.AbstractParticle.prototype.getY = function() {
		return this.position.y;
	};
	
	Normous.Physics.Twod.AbstractParticle.prototype.getVelocity = function() {
		return this.position.subtract(this.previous);
	};
	
	Normous.Physics.Twod.AbstractParticle.prototype.setVelocity = function(velocity) {
		this.previous = this.position.subtract(velocity);
	};
	
	Normous.Physics.Twod.AbstractParticle.prototype.addForce = function(force) {
		this.forces.push(force);
	};
	
	Normous.Physics.Twod.AbstractParticle.prototype.update = function(dt2) {
		if(this.fixed) {	
			return;
		}
		this.accumulateForces();
		this._temp.set(this.position);
		this.accumulatedForce.imultiply(dt2);
		var normal = this.getVelocity().add(this.accumulatedForce);
		normal.imultiply(Normous.Physics.Twod.GlobalForces.damping);
		this.position.iadd(normal);
		this.previous.set(this._temp);
		
		this.clearForces();
	};
	
	Normous.Physics.Twod.AbstractParticle.prototype.accumulateForces = function() {
		var f, i;
		
		var len = this.forces.length;
		for (i = 0; i < len; i++) {
			f = this.forces[i];
			this.accumulatedForce.iadd(f.getValue(this._inverseMass));
		}
		
		var globalForces = Normous.Physics.Twod.GlobalForces.forces;
		len = globalForces.length;
		for (i = 0; i < len; i++) {
			f = globalForces[i];
			this.accumulatedForce.iadd(f.getValue(this._inverseMass));
		}
	};
	
	Normous.Physics.Twod.AbstractParticle.prototype.clearForces = function() {
		this.forces = new Array();
		this.accumulatedForce.zero();
	};
	
	Normous.Physics.Twod.AbstractParticle.prototype.getInverseMass = function() {
		if(this.fixed) { 
			return 0; 
		}
		return this._inverseMass;
	};
	
	Normous.Physics.Twod.AbstractParticle.prototype.testParticleEvents = function(particle, normal, mtd, o) {
		this.dispatchEvent(new Normous.Physics.Twod.CollisionEvent({type: Normous.Physics.Twod.CollisionEvent.COLLIDE, item: this, o:o, collidingItem: particle, normal: normal, mtd: mtd}));
		
		if (!this.firstCollision) {
			this.firstCollision = true;
			this.dispatchEvent(new Normous.Physics.Twod.CollisionEvent({type:Normous.Physics.Twod.CollisionEvent.FIRST_COLLIDE, item: this, o:o, collidingItem: particle, normal: normal, mtd: mtd}));
		}
	};
	
	Normous.Physics.Twod.AbstractParticle.prototype.resolveCollision = function(mtd, velocity, normal, damping, o, particle) {
		//Normous.Logger.log("Normous.Physics.Twod.AbstractParticle.resolveCollision()");
		this.testParticleEvents(particle, normal, mtd, o);
		if(this.fixed || !this.solid || !particle.solid) {
			return;
		}
		//this.position.set(this.sample);
		this.position.iadd(mtd);
		this.setVelocity(velocity);
	};
	
	Normous.Physics.Twod.AbstractParticle.prototype.getComponents = function(collisionNormal) {
		var vel = this.getVelocity();
		var vdotn = collisionNormal.dot(vel);
		this.collision.vn = collisionNormal.multiply(vdotn);
		this.collision.vt = vel.subtract(this.collision.vn); 
		return this.collision;
	};
	
	Normous.Physics.Twod.AbstractParticle.prototype.serialize = function() {
		var obj = this._super('serialize');
		obj.inverseMass = this.getInverseMass();
		obj.friction = this.friction;
		obj.elasticity = this.elasticity;
		obj.position = { x: this.position.x, y: this.position.y };
		obj.previous = { x: this.previous.x, y: this.previous.y };
		obj.multisample = this.multisample;
		obj.firstCollision = this.firstCollision;
		obj.collidable = this.collidable;
		obj.forces = [];
		
		for(var i = 0; i < this.forces.length; i++) {
			obj.forces.push(this.forces[i].serialize());
		}
		
		return obj;
	};
	
	Normous.Physics.Twod.AbstractParticle.prototype.unserialize = function(obj) {
		this._super('unserialize', obj);
		this._inverseMass = obj.inverseMass;
		this.friction = obj.friction;
		this.elasticity = obj.elasticity;
		this.position.reset(obj.position.x, obj.position.y);
		this.previous.reset(obj.previous.x, obj.previous.y);
		this.multisample = obj.multisample;
		this.firstCollision = obj.firstCollision;
		this.collidable = obj.collidable;
		
		this.clearForces();
		for(var i = 0; i < obj.forces.length; i++) {
			var f = obj.forces[i];
			var force = new Normous.Physics.Twod.Force();
			force.unserialize(f);
			this.addForce(force);
		}
	};
	
	Normous.Physics.Twod.AbstractParticle.prototype.create = function(obj) {
		this._super('create', obj);
		this._inverseMass = obj.inverseMass;
		this.friction = obj.friction;
		this.elasticity = obj.elasticity;
		this.position.reset(obj.position.x, obj.position.y);
		this.previous.reset(obj.previous.x, obj.previous.y);
		this.multisample = obj.multisample;
		this.firstCollision = obj.firstCollision;
		this.collidable = obj.collidable;
	};
	
});