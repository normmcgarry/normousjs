define([
	'normous/physics/twod/AbstractParticle',
	'normous/physics/twod/drawables/CreatejsRectangle',
	'normous/math/Vector2',
	'normous/math/Utils'
], function() {
	
	
	
	Normous.namespace("Normous.Physics.Twod.RectangleParticle");
	
	
	
	Normous.Physics.Twod.RectangleParticle = function(config) {
		if(config == null) config = {};
		this.drawable = new Normous.Physics.Twod.Drawables.CreatejsRectangle({item:this, drawableProperties: config.drawableProperties});
		this._super(config);
		this.extents = new Array(this.width/2, this.height/2);
		this.axes  = new Array(new Normous.Math.Vector2(), new Normous.Math.Vector2());
		this.setRadian(this.rotation);
	};
	
	Normous.Object.inherit(Normous.Physics.Twod.RectangleParticle, Normous.Physics.Twod.AbstractParticle);
	
	Normous.Physics.Twod.RectangleParticle.prototype.width = 100;
	Normous.Physics.Twod.RectangleParticle.prototype.height = 100;
	
	Normous.Physics.Twod.RectangleParticle.prototype.extents;
	Normous.Physics.Twod.RectangleParticle.prototype.axes;
	Normous.Physics.Twod.RectangleParticle.prototype.radian = 0;
	Normous.Physics.Twod.RectangleParticle.prototype.rotation = 0;
	
	Normous.Physics.Twod.RectangleParticle.prototype.init = function() {
		//Normous.Logger.log("Normous.Physics.Twod.RectangleParticle.init()");
		this.cleanup();
		this.paint();
	};
	
	Normous.Physics.Twod.RectangleParticle.prototype.setRadian = function(t) {
		this.radian = t;
		this.setAxes(t);
	};
	Normous.Physics.Twod.RectangleParticle.prototype.getRadian = function() {
		return this.radian;
	};
	
	Normous.Physics.Twod.RectangleParticle.prototype.paint = function() {
		//Normous.Logger.log("Normous.Physics.Twod.RectangleParticle.paint()");
		this.drawable.paint();
	};
	
	Normous.Physics.Twod.RectangleParticle.prototype.getAngle = function() {
		return this.radian * Normous.Math.Utils.ONE_EIGHTY_OVER_PI;
	};
	
	Normous.Physics.Twod.RectangleParticle.prototype.setAngle = function(a) {
		this.setRadian(a * Normous.Math.Utils.PI_OVER_ONE_EIGHTY);
	};
	
	Normous.Physics.Twod.RectangleParticle.prototype.getProjection = function(axis) {
		var radius =
			this.extents[0] * Math.abs(axis.dot(this.axes[0]))+
			this.extents[1] * Math.abs(axis.dot(this.axes[1]));
		
		var c = this.sample.dot(axis);
		
		this.interval.min = c - radius;
		this.interval.max = c + radius;
		
		return this.interval;
	};
	
	Normous.Physics.Twod.RectangleParticle.prototype.setAxes = function(t) {
		var s = Math.sin(t);
		var c = Math.cos(t);
		
		this.axes[0].x = c;
		this.axes[0].y = s;
		this.axes[1].x = -s;
		this.axes[1].y = c;
	};
	
	Normous.Physics.Twod.RectangleParticle.prototype.setWidth = function(width) {
		this.width = width;
		this.extents = new Array(this.width/2, this.height/2);
		this.setRadian(this.rotation);
		this.drawable.paint();
	};
	
	Normous.Physics.Twod.RectangleParticle.prototype.setHeight = function(height) {
		this.height = height;
		this.extents = new Array(this.width/2, this.height/2);
		this.setRadian(this.rotation);
		this.drawable.paint();
	};
	
	Normous.Physics.Twod.RectangleParticle.prototype.getWidth = function() {
		return this.width;
	};
	
	Normous.Physics.Twod.RectangleParticle.prototype.getHeight = function() {
		return this.height;
	};
	
});