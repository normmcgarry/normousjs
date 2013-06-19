
define([
    'normous/Normous', 'normous/Object', 'normous/physics/ForceRegistration'
], function() {
    Normous.namespace("Normous.Physics.ForceRegistry");
    
    Normous.Physics.ForceRegistry = function(config) {
        this.forces = [];
        this.parent(config);
    };
    Normous.Object.inherit(Normous.Physics.ForceRegistry, Normous.Object);
    
    Normous.Physics.ForceRegistry.prototype.addForce = function(particle, generator) {
        var registration = new Normous.Physics.ForceRegistration({
            particle:particle,
            generator: generator
        });
        this.forces.push(registration);
    };
    
    
    Normous.Physics.ForceRegistry.prototype.removeForce = function(particle, generator) {
        for(var i = 0; i < this.forces.length; i++) {
            var force = this.forces[i];
            if(force.particle == particle && force.generator == generator) {
                this.forces.splice(i, 1);
            }
            return;
        }
    };
    
    Normous.Physics.ForceRegistry.prototype.clearForces = function() {
        this.forces = [];
    }
    
    Normous.Physics.ForceRegistry.prototype.update = function(duration) {
        var i;
        for(i = 0; i < this.forces.length; i++) {
            var registration = this.forces[i];
            registration.generator.updateForce(registration.particle, duration);
        }
    }
});