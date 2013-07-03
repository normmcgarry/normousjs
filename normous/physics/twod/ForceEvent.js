define([
	'normous/events/Event'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.ForceEvent");
	
	Normous.Physics.Twod.ForceEvent = function(config) {
		this.bubbles = true;
		this._super(config);
	};
	
	Normous.Object.inherit(Normous.Physics.Twod.ForceEvent, Normous.Events.Event);
	
	Normous.Physics.Twod.ForceEvent.FORCE_APPLIED = "forceApplied";
	
	Normous.Physics.Twod.ForceEvent.prototype.force = null;
	Normous.Physics.Twod.ForceEvent.prototype.particle = null;
	
	Normous.Physics.Twod.ForceEvent.prototype.getForce = function() {
		return this.force;
	};
	
	Normous.Physics.Twod.ForceEvent.prototype.getParticle = function() {
		return this.particle;
	};
	
});