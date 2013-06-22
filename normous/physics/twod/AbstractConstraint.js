define([
	'normous/physics/twod/AbstractItem'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.AbstractConstraint");
	
	Normous.Physics.Twod.AbstractConstraint = function(config) {
		this.parent(config);
	};
	
	Normous.Object.inherit(Normous.Physics.Twod.AbstractConstraint, Normous.Physics.Twod.AbstractItem);
	
	Normous.Physics.Twod.AbstractConstraint.prototype.stiffness = 1;
	
	Normous.Physics.Twod.AbstractConstraint.prototype.resolve = function() {
		
	};
	
	
});