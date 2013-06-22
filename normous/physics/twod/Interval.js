define([
	'normous/Object'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.Interval");
	
	Normous.Physics.Twod.Interval = function(config) {
		this.parent(config);
	};
	Normous.Object.inherit(Normous.Physics.Twod.Interval, Normous.Object);
	
	Normous.Physics.Twod.Interval.prototype.min = 0;
	Normous.Physics.Twod.Interval.prototype.max = 0;
});