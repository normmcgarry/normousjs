
define([
    'Normous', 'normous/Object', 'normous/math/Vector2'
], function() {
    Normous.namespace("Normous.Physics.PinConstraint");
    
    Normous.Physics.PinConstraint = function(config) {
        this.parent(config);
        
        if(this.position == null) {
            this.position = {x:0, y:0};
        }
        this.position = new Normous.Math.Vector2({
            x: this.position.x,
            y: this.position.y
        });
    };
    Normous.Object.inherit(Normous.Physics.PinConstraint, Normous.Object);
    
    Normous.Physics.PinConstraint.prototype.point1 = null;
    Normous.Physics.PinConstraint.prototype.position = null;
    
    Normous.Physics.PinConstraint.prototype.relax = function(stepCoef) {
        this.point1.position.reset(this.position.x, this.position.y);
    };
});