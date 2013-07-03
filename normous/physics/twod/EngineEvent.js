define([
	'normous/events/Event'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.EngineEvent");
	
	Normous.Physics.Twod.EngineEvent = function(config) {
		this.bubbles = true;
		this._super(config);
	};
	
	Normous.Object.inherit(Normous.Physics.Twod.EngineEvent, Normous.Events.Event);
	
	Normous.Physics.Twod.EngineEvent.PARTICLE_ADDED = "particleAdded";
	Normous.Physics.Twod.EngineEvent.PARTICLE_REMOVED = "particleRemoved";
	Normous.Physics.Twod.EngineEvent.CONSTRAINT_ADDED = "constraintAdded";
	Normous.Physics.Twod.EngineEvent.CONSTRAINT_REMOVED = "constraintRemoved";
	Normous.Physics.Twod.EngineEvent.COMPOSITE_ADDED = "compositeAdded";
	Normous.Physics.Twod.EngineEvent.COMPOSITE_REMOVED = "compositeRemoved";
	Normous.Physics.Twod.EngineEvent.GROUP_ADDED = "groupAdded";
	Normous.Physics.Twod.EngineEvent.GROUP_REMOVED = "groupRemoved";
	Normous.Physics.Twod.EngineEvent.FORCE_ADDED = "groupAdded";
	
	Normous.Physics.Twod.EngineEvent.prototype.element = null;
	
	Normous.Physics.Twod.EngineEvent.prototype.getElement = function() {
		return this.element;
	};
	
});