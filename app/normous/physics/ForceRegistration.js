
define([
    'Normous', 'normous/Object', 'normous/physics/Particle'
], function() {
    Normous.namespace("Normous.Physics.ForceRegistration");

    Normous.Physics.ForceRegistration = function(config) {
        this.parent(config);
    };
    Normous.Object.inherit(Normous.Physics.ForceRegistration, Normous.Object);
    
    Normous.Physics.ForceRegistration.prototype.particle;
    Normous.Physics.ForceRegistration.prototype.generator;
    
});