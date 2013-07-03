define([
	'normous/events/EventDispatcher',
	'normous/concurrency/WorkerQuery',
], function() {
	
	Normous.namespace("Normous.Physics.Twod.EngineSynchronizer");
	
	Normous.Physics.Twod.EngineSynchronizer = function(config) {
		this._super(config);
	};
	
	Normous.Object.inherit(Normous.Physics.Twod.EngineSynchronizer, Normous.Events.EventDispatcher);
	
	Normous.Physics.Twod.EngineSynchronizer.prototype.init = function() {
		this.worker = new Worker("physics.js");
		this.worker.addEventListener("message", Normous.bind(this.onMessage, this));
		
		this.engine.addEventListener(Normous.Physics.Twod.EngineEvent.PARTICLE_ADDED, Normous.bind(this.onParticleAdded, this));
		this.engine.addEventListener(Normous.Physics.Twod.EngineEvent.PARTICLE_REMOVED, Normous.bind(this.onParticleRemoved, this));
		this.engine.addEventListener(Normous.Physics.Twod.EngineEvent.CONSTRAINT_ADDED, Normous.bind(this.onConstraintAdded, this));
		this.engine.addEventListener(Normous.Physics.Twod.EngineEvent.CONSTRAINT_REMOVED, Normous.bind(this.onConstraintRemoved, this));
		this.engine.addEventListener(Normous.Physics.Twod.EngineEvent.COMPOSITE_ADDED, Normous.bind(this.onCompositeAdded, this));
		this.engine.addEventListener(Normous.Physics.Twod.EngineEvent.COMPOSITE_REMOVED, Normous.bind(this.onCompositeRemoved, this));
		this.engine.addEventListener(Normous.Physics.Twod.EngineEvent.GROUP_ADDED, Normous.bind(this.onGroupAdded, this));
		this.engine.addEventListener(Normous.Physics.Twod.EngineEvent.GROUP_REMOVED, Normous.bind(this.onGroupRemoved, this));
	};
	
	Normous.Physics.Twod.EngineSynchronizer.prototype.addGroup = function(group) {
		var serialized = group.serialize();
		
		var queryable = new Normous.Concurrency.WorkerQuery({
			methodName: 'addGroup',
			params: serialized
		});
		this.worker.postMessage(queryable);
	};
	
	Normous.Physics.Twod.EngineSynchronizer.prototype.onParticleAdded = function(e) {
		var serialized = e.element.serialize();
		
		var queryable = new Normous.Concurrency.WorkerQuery({
			methodName: 'addParticle',
			params: [
				e.element.parent.id,
				serialized
			]
		});
		this.worker.postMessage(queryable);
	};
	Normous.Physics.Twod.EngineSynchronizer.prototype.onParticleRemoved = function(e) {
		var serialized = e.element.serialize();
		
		var queryable = new Normous.Concurrency.WorkerQuery({
			methodName: 'removeParticle',
			params: [
				e.element.parent.id,
				serialized
			]
		});
		this.worker.postMessage(queryable);
	};
	Normous.Physics.Twod.EngineSynchronizer.prototype.onConstraintAdded = function(e) {
		var serialized = e.element.serialize();
		
		var queryable = new Normous.Concurrency.WorkerQuery({
			methodName: 'addConstraint',
			params: [
				e.element.parent.id,
				serialized
			]
		});
		this.worker.postMessage(queryable);
	};
	Normous.Physics.Twod.EngineSynchronizer.prototype.onConstraintRemoved = function(e) {
		var serialized = e.element.serialize();
		
		var queryable = new Normous.Concurrency.WorkerQuery({
			methodName: 'removeConstraint',
			params: [
				e.element.parent.id,
				serialized
			]
		});
		this.worker.postMessage(queryable);
	};
	Normous.Physics.Twod.EngineSynchronizer.prototype.onCompositeAdded = function(e) {
		var serialized = e.element.serialize();
		
		var queryable = new Normous.Concurrency.WorkerQuery({
			methodName: 'addComposite',
			params: [
				e.element.parent.id,
				serialized
			]
		});
		this.worker.postMessage(queryable);
	};
	Normous.Physics.Twod.EngineSynchronizer.prototype.onCompositeRemoved = function(e) {
		var serialized = e.element.serialize();
		
		var queryable = new Normous.Concurrency.WorkerQuery({
			methodName: 'removeComposite',
			params: [
				e.element.parent.id,
				serialized
			]
		});
		this.worker.postMessage(queryable);
	};
	Normous.Physics.Twod.EngineSynchronizer.prototype.onGroupAdded = function(e) {
		var serialized = e.element.serialize();
		
		var queryable = new Normous.Concurrency.WorkerQuery({
			methodName: 'addGroup',
			params: [
				serialized
			]
		});
		this.worker.postMessage(queryable);
	};
	Normous.Physics.Twod.EngineSynchronizer.prototype.onGroupRemoved = function(e) {
		var serialized = e.element.serialize();
		
		var queryable = new Normous.Concurrency.WorkerQuery({
			methodName: 'removeGroup',
			params: [
				serialized
			]
		});
		this.worker.postMessage(queryable);
	};
	
});