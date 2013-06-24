define([
	'normous/Object'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.Drawables");
	
	Normous.Physics.Twod.Drawable = function(config) {
		this._super(config);
	};
	Normous.Object.inherit(Normous.Physics.Twod.Drawable, Normous.Object);
	
	Normous.Physics.Twod.Drawable.prototype.item;
	
	Normous.Physics.Twod.Drawable.prototype.paint = function() {
	};
	
});