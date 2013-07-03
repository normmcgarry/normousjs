define([
	
], function() {
	
	Normous.namespace("Normous.Physics.Twod.GlobalForces");
	
	
	Normous.Physics.Twod.GlobalForces = function(config) {
		this._super(config);
	};
	
	Normous.Object.inherit(Normous.Physics.Twod.GlobalForces, Normous.Object);
	Normous.Singleton.createSingleton(Normous.Physics.Twod.GlobalForces);
	
	Normous.Physics.Twod.GlobalForces.forces = [];
	Normous.Physics.Twod.GlobalForces.damping = [];
	
	Normous.Physics.Twod.GlobalForces.addForce = function(force) {
		this.push(force);
	};
	
	Normous.Physics.Twod.GlobalForces.removeForce = function(force) {
		var index = Normous.Physics.Twod.GlobalForces.forces.indexOf(force);
		if(index == -1 && force.id != null) {
			for(var i = 0; i < Normous.Physics.Twod.GlobalForces.forces.length; i++) {
				var f = Normous.Physics.Twod.GlobalForces.forces[i];
				if(f.id != null && f.id == force.id) {
					index = i;
					break;
				}
			}
		}
		if(index == -1) {
			return;
		}
		Normous.Physics.Twod.GlobalForces.forces.splice(index, 1);
	};
	
});