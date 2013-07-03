define([
	'normous/Object',
	'normous/events/EventDispatcher'
], function() {
	
	Normous.namespace("Normous.Physics.Twod.Id");
	
	
	Normous.Physics.Twod.Id = function(config) {
		
	};
	
	Normous.Object.inherit(Normous.Physics.Twod.Id, Normous.Object);
	
	Normous.Physics.Twod.Id.currentId = 0;
	
	Normous.Physics.Twod.Id.generate = function() {
		return ++Normous.Physics.Twod.Id.currentId;
	};
	
});