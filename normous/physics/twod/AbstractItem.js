define([
	'normous/events/EventDispatcher',
	'normous/physics/twod/GlobalCollection',
	'normous/physics/twod/Id'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.AbstractItem");
	
	Normous.Physics.Twod.AbstractItem = function(config) {
		this.id = Normous.Physics.Twod.Id.generate();
		this.drawableProperties = {};
		this._super(config);
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
	
	Normous.Physics.Twod.AbstractItem.prototype.serialize = function() {
		var obj = {};
		obj.solid = this.solid;
		obj.id = this.id;
		return obj;
	};
	
	Normous.Physics.Twod.AbstractItem.prototype.unserialize = function(obj) {
		this.solid = obj.solid;
	};
	
	Normous.Physics.Twod.AbstractItem.prototype.create = function(obj) {
		this.id = obj.id;
		this.solid = obj.solid;
	};
	
});