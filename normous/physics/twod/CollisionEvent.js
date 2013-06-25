define([
	'normous/events/Event'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.CollisionEvent");
	
	Normous.Physics.Twod.CollisionEvent = function(config) {
		this.bubbles = true;
		this._super(config);
	};
	
	Normous.Object.inherit(Normous.Physics.Twod.CollisionEvent, Normous.Events.Event);
	
	Normous.Physics.Twod.CollisionEvent.COLLIDE = "collide";
	Normous.Physics.Twod.CollisionEvent.FIRST_COLLIDE = "firstCollide";
	
	Normous.Physics.Twod.CollisionEvent.prototype.item = null;
	Normous.Physics.Twod.CollisionEvent.prototype.collidingItem = null;
	Normous.Physics.Twod.CollisionEvent.prototype.normal = null;
	Normous.Physics.Twod.CollisionEvent.prototype.mtd = null;
	
	Normous.Physics.Twod.CollisionEvent.prototype.getCollidingItem = function() {
		if(this.collidingItem instanceof Normous.Physics.Twod.SpringConstraintParticle) {
			return this.collidingItem.parent;	
		}
		return this.collidingItem;
	};
	
});