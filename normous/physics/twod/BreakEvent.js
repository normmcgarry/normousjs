define([
	'normous/events/Event'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.BreakEvent");
	
	Normous.Physics.Twod.BreakEvent = function(config) {
		this.bubbles = true;
		this._super(config);
	};
	
	Normous.Object.inherit(Normous.Physics.Twod.BreakEvent, Normous.Events.Event);
	
	Normous.Physics.Twod.BreakEvent.BREAK = "break";
	
	Normous.Physics.Twod.BreakEvent.prototype.constraint = null;
	
	Normous.Physics.Twod.BreakEvent.prototype.getConstraint = function() {
		return this.constraint;
	};
	
});