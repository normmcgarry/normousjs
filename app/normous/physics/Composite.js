
define([
    'normous/Normous', 'normous/Object', 'normous/math/Vector2', 'normous/physics/PinConstraint'
], function() {
    Normous.namespace("Normous.Physics.Composite");
    
    Normous.Physics.Composite = function(config) {
        this.parent(config);
    };
    Normous.Object.inherit(Normous.Physics.Composite, Normous.Object);
    
    Normous.Physics.Composite.prototype.particles = null;
    Normous.Physics.Composite.prototype.constraints = null;
    
    Normous.Physics.Composite.prototype.pin = function(index, position) {
        position = position || this.particles[index].position;
        var pc = new Normous.Physics.PinConstraint(this.particles[index], position);
        this.constraints.push(pc);
        return pc;
    }

});