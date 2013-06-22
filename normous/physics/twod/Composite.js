define([
	'normous/physics/twod/AbstractCollection',
	'normous/math/Vector2',
	'normous/math/Utils'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.Composite");
	
	Normous.Physics.Twod.Composite = function(config) {
		this.delta = new Normous.Math.Vector2();
		this.parent(config);
	};
	Normous.Object.inherit(Normous.Physics.Twod.Composite, Normous.Physics.Twod.AbstractCollection);
	
	Normous.Physics.Twod.Composite.prototype.delta;
	
	Normous.Physics.Twod.Composite.prototype.rotateByRadian = function(angleRadians, center) {
		var p;
		var pa = particles;
		var len = pa.length;
		for(var i = 0; i < len; i++) {
			p = pa[i];
			var radius = p.center.distance(center);
			var angle = this.getRelativeAngle(center, p.center) + angleRadians;
			p.px = (Math.cos(angle) * radius) + center.x;
			p.py = (Math.sin(angle) * radius) + center.y;
		}
	};
	
	Normous.Physics.Twod.Composite.prototype.rotateByAngle = function(angleDegrees, center) {
		var angleRadians = angleDegrees * Normous.Math.Utils.PI_OVER_ONE_EIGHTY;
		return this.rotateByRadian(angleRadians, center);
	};
	
	Normous.Physics.Twod.Composite.prototype.getRelativeAngle = function(center, p) {
		this.delta.reset(p.x - center.x, p.y - center.y);
		return Math.atan2(delta.y, delta.x);
	};
});