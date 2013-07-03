define([
	'normous/physics/twod/AbstractItem'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.AbstractConstraint");
	
	Normous.Physics.Twod.AbstractConstraint = function(config) {
		this._super(config);
	};
	
	Normous.Object.inherit(Normous.Physics.Twod.AbstractConstraint, Normous.Physics.Twod.AbstractItem);
	
	Normous.Physics.Twod.AbstractConstraint.prototype.stiffness = 1;
	Normous.Physics.Twod.AbstractConstraint.prototype.priority = 0;
	
	Normous.Physics.Twod.AbstractConstraint.prototype.resolve = function() {
		
	};
	
	Normous.Physics.Twod.AbstractConstraint.prototype.serialize = function() {
		
		var obj = this._super('serialize');
		obj.stiffness = this.stiffness;
		obj.priority = this.priority;
		
		return obj;
		
	};
	
	
	Normous.Physics.Twod.AbstractConstraint.prototype.unserialize = function(obj) {
		this._super('unserialize', obj);
		this.stiffness = obj.stiffness;
		this.priority = obj.priority;
	};
	
	Normous.Physics.Twod.AbstractConstraint.prototype.create = function(obj) {
		this._super('create', obj);
		this.stiffness = obj.stiffness;
		this.priority = obj.priority;
	};
	
	
});