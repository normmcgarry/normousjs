define([
	'normous/Object',
	'normous/events/EventDispatcher'
], function() {
	
	
	
	Normous.namespace("Normous.Physics.Twod.EngineWorker");
	
	Normous.Physics.Twod.EngineWorker = function(config) {
		this.groups = new Array();
		this._super(config);
	};
	
	Normous.Object.inherit(Normous.Physics.Twod.EngineWorker, Normous.Events.EventDispatcher);
	
	Normous.Physics.Twod.EngineWorker.prototype.engine = null;
	
	Normous.Physics.Twod.EngineWorker.prototype.createGroup = function(obj) {
		var group = new Normous.Physics.Twod.Group();
		group.create(obj);
		this.engine.addGroup(group);
	};
	
});