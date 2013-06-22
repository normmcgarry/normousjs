define([
	'normous/Object',
	'normous/math/Vector2'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.Force");
	
	
	Normous.Physics.Twod.Force = function(config) {
		this.parent(config);
		this.value = new Normous.Math.Vector2(this.x, this.y);
	};
	
	Normous.Object.inherit(Normous.Physics.Twod.Force, Normous.Object);
	
	Normous.Physics.Twod.Force.prototype.x = 0;
	Normous.Physics.Twod.Force.prototype.y = 0;
	
	Normous.Physics.Twod.Force.prototype.value;
	Normous.Physics.Twod.Force.prototype.scaleMass = true;
	
	Normous.Physics.Twod.Force.prototype.getValue = function(inverseMass) {
		if(this.scaleMass) {
			this.value.reset(this.x * inverseMass, this.y * inverseMass);
		}
		return this.value;
	};
	
	
});