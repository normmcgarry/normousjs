define([
	'normous/Object',
	'normous/physics/twod/Drawable'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.Drawables.CreatejsCollection");
	
	Normous.Physics.Twod.Drawables.CreatejsCollection = function(config) {
		 var drawableProperties = {
			lineThickness: 1,
			lineColor: "rgba(255,0,0,0.5)",
			fillColor: "rgba(0,0,255,0.5)"
		};
		this._super(config);
		this.drawableProperties = Normous.extend(drawableProperties, config.drawableProperties);
		this.element = new createjs.Container();
	};
	Normous.Object.inherit(Normous.Physics.Twod.Drawables.CreatejsCollection, Normous.Physics.Twod.Drawable);

	Normous.Physics.Twod.Drawables.CreatejsCollection.prototype.drawableProperties;
	Normous.Physics.Twod.Drawables.CreatejsCollection.prototype.element;
	
	Normous.Physics.Twod.Drawables.CreatejsCollection.prototype.init = function() {
	};
	
	Normous.Physics.Twod.Drawables.CreatejsCollection.prototype.paint = function() {
	};
	
	Normous.Physics.Twod.Drawables.CreatejsCollection.prototype.addChild = function(item) {
		this.element.addChild(item.drawable.element);
	};
	
	Normous.Physics.Twod.Drawables.CreatejsCollection.prototype.removeChild = function(item) {
		this.element.removeChild(item.drawable.element);
	};
	
});