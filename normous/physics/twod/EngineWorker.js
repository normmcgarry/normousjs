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
	
	Normous.Physics.Twod.EngineWorker.prototype.addGroup = function(obj) {
		var group = new Normous.Physics.Twod.Group();
		group.create(obj);
		this.engine.addGroup(group);
	};
	
	Normous.Physics.Twod.EngineWorker.prototype.removeGroup = function(obj) {
		var group = Normous.Physics.Twod.GlobalCollection.getGroupById(obj.id);
		this.engine.removeGroup(group);
	};
	
	Normous.Physics.Twod.EngineWorker.prototype.addParticle = function(parentId, obj) {
		var collection = Normous.Physics.Twod.GlobalCollection.getById(parentId);
		var type = Normous.getObjectByName(obj.type);
		var particle = new type();
		particle.create(obj);
		collection.addParticle(particle);
	};
	
	Normous.Physics.Twod.EngineWorker.prototype.removeParticle = function(parentId, obj) {
		var collection = Normous.Physics.Twod.GlobalCollection.getById(parentId);
		var particle = Normous.Physics.Twod.GlobalCollection.getById(obj.id);
		collection.removeParticle(particle);
	};
	
	Normous.Physics.Twod.EngineWorker.prototype.addConstraint = function(parentId, obj) {
		var collection = Normous.Physics.Twod.GlobalCollection.getById(parentId);
		var type = Normous.getObjectByName(obj.type);
		var constraint = new type();
		constraint.create(obj);
		collection.addConstraint(constraint);
	};
	
	Normous.Physics.Twod.EngineWorker.prototype.removeParticle = function(parentId, obj) {
		var collection = Normous.Physics.Twod.GlobalCollection.getById(parentId);
		var constraint = Normous.Physics.Twod.GlobalCollection.getById(obj.id);
		collection.removeConstraint(constraint);
	};
	
	Normous.Physics.Twod.EngineWorker.prototype.addComposite = function(parentId, obj) {
		var collection = Normous.Physics.Twod.GlobalCollection.getById(parentId);
		var type = Normous.getObjectByName(obj.type);
		var constraint = new type();
		composite.create(obj);
		collection.addComposite(composite);
	};
	
	Normous.Physics.Twod.EngineWorker.prototype.removeComposite = function(parentId, obj) {
		var collection = Normous.Physics.Twod.GlobalCollection.getById(parentId);
		var composite = Normous.Physics.Twod.GlobalCollection.getById(obj.id);
		collection.removeComposite(composite);
	};
});