define([
	'normous/Object'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.Collision");
	
	Normous.Physics.Twod.Collision = function(config) {
		this.vn = new Normous.Math.Vector2();
		this.vx = new Normous.Math.Vector2();
		this.parent(config);
	};
	Normous.Object.inherit(Normous.Physics.Twod.Collision, Normous.Object);
	
	Normous.Physics.Twod.Collision.prototype.vn;
	Normous.Physics.Twod.Collision.prototype.vx;
	
});