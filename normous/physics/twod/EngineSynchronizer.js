define([
	'normous/events/EventDispatcher'
], function() {
	
	Normous.namespace("Normous.Physics.Twod.EngineSynchronizer");
	
	Normous.Physics.Twod.EngineSynchronizer = function(config) {
		this._super(config);
	};
	
	Normous.Object.inherit(Normous.Physics.Twod.EngineSynchronizer, Normous.Events.EventDispatcher);
	
	Normous.Physics.Twod.EngineSynchronizer.prototype.init = function() {
		this.worker = new Worker("physics.js");
		this.worker.addEventListener("message", Normous.bind(this.onMessage, this));
	};
	
	Normous.Physics.Twod.EngineSynchronizer.prototype.addGroup = function(group) {
		var serialized = group.serialize();
	};
});