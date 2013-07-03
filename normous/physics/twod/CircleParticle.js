define([
	'normous/physics/twod/AbstractParticle',
	'normous/physics/twod/drawables/CreatejsCircle',
	'normous/math/Vector2',
	'normous/math/Utils'
], function() {
	
	
	
	Normous.namespace("Normous.Physics.Twod.CircleParticle");
	
	
	
	Normous.Physics.Twod.CircleParticle = function(config) {
		if(config == null) config = {};
		this.drawable = new Normous.Physics.Twod.Drawables.CreatejsCircle({item:this, drawableProperties: config.drawableProperties});
		this._super(config);
	};
	
	Normous.Object.inherit(Normous.Physics.Twod.CircleParticle, Normous.Physics.Twod.AbstractParticle);
	
	Normous.Physics.Twod.CircleParticle.prototype.radius = 0;
    Normous.Physics.Twod.CircleParticle.TYPE = "Normous.Physics.Twod.CircleParticle";
	
	Normous.Physics.Twod.CircleParticle.prototype.init = function() {
		this.cleanup();
	};
	
	Normous.Physics.Twod.CircleParticle.prototype.paint = function() {
		this.drawable.paint();
	};
	
	Normous.Physics.Twod.CircleParticle.prototype.getProjection = function(axis) {
		var c = this.sample.dot(axis);
		this.interval.min = c - this.radius;
		this.interval.max = c + this.radius;
		
		return this.interval;
	};
	
	Normous.Physics.Twod.CircleParticle.prototype.getIntervalX = function() {
		this.interval.min = this.sample.x - this.radius;
		this.interval.max = this.sample.x + this.radius;
		return this.interval;
	};
	
	Normous.Physics.Twod.CircleParticle.prototype.getIntervalY = function() {
		this.interval.min = this.sample.y - this.radius;
		this.interval.max = this.sample.y + this.radius;
		return this.interval;
	};
	
	Normous.Physics.Twod.CircleParticle.prototype.serialize = function() {
		var obj = this._super('serialize');
		obj.radius = this.radius;
		obj.type = Normous.Physics.Twod.CircleParticle.TYPE;
		
		return obj;
	};
	
	Normous.Physics.Twod.CircleParticle.prototype.unserialize = function(obj) {
		this._super('unserialize', obj);
		this.radius = obj.radius;
	};
	
	Normous.Physics.Twod.CircleParticle.prototype.create = function(obj) {
		this._super('create', obj);
		this.radius = obj.radius;
	};
	
});