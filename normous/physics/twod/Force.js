define([
	'normous/Object',
	'normous/math/Vector2',
	'normous/physics/twod/Id
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.Force");
	
	
	Normous.Physics.Twod.Force = function(config) {
		this.id = Normous.Physics.Twod.Id.generate();
		this._super(config);
		this.value = new Normous.Math.Vector2({x: this.x, y: this.y});
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
	
	Normous.Physics.Twod.Force.prototype.serialize = function() {
		var obj = {};
		obj.x = this.x;
		obj.y = this.y;
		obj.scaleMass = this.scaleMass;
		return obj;
	};
	Normous.Physics.Twod.Force.prototype.unserialize = function(obj) {
		this.x = obj.x;
		this.y = obj.y;
		this.scaleMass = obj.scaleMass;
	};
	
});