define([
	'normous/events/EventDispatcher'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.AbstractItem");
	
	Normous.Physics.Twod.AbstractItem = function(config) {
		this.drawableProperties = {};
		this.parent(config);
	};
	Normous.Object.inherit(Normous.Physics.Twod.AbstractItem, Normous.Events.EventDispatcher);
	
	
	
	Normous.Physics.Twod.AbstractItem.prototype.drawable = null;
	Normous.Physics.Twod.AbstractItem.prototype.drawableProperties = null;
	
	Normous.Physics.Twod.AbstractItem.prototype.solid = true;
	Normous.Physics.Twod.AbstractItem.prototype.visible = true;
	Normous.Physics.Twod.AbstractItem.prototype.alwaysRepaint = false;
	
	
	Normous.Physics.Twod.AbstractItem.prototype.init = function() {
		
	};
	
	Normous.Physics.Twod.AbstractItem.prototype.paint = function() {
		
	};
	
	Normous.Physics.Twod.AbstractItem.prototype.cleanup = function() {
		
	};
	
	
});