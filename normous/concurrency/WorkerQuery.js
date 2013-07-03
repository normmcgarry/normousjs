define([
	'normous/Object'
], function() {
	
	
	Normous.namepsace("Normous.Concurrency.WorkerQuery");
	
	Normous.Concurrency.WorkerQuery = function(config) {
		this._super(config);
	};
	
	Normous.Object.inherit(Normous.Concurrency.WorkerQuery, Normous.Object);
	
	Normous.Concurrency.WorkerQuery.prototype.methodName = null;
	Normous.Concurrency.WorkerQuery.prototype.params = null;
	
	
	
});