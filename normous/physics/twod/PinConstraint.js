define([
    'normous/physics/twod/AbstractConstraint',
    'normous/physics/twod/BreakEvent',
    'normous/physics/twod/drawables/CreatejsPinConstraint',
    'normous/math/Utils'
], function() {

    Normous.namespace("Normous.Physics.Twod.PinConstraint");


    Normous.Physics.Twod.PinConstraint = function(config) {
        this.drawable = new Normous.Physics.Twod.Drawables.CreatejsPinConstraint({item:this, drawableProperties: config.drawableProperties});
		this.position = new Normous.Math.Vector2();
		this.broken = false;
        this._super(config);
		this.p1.fixed = true;
    };

    Normous.Object.inherit(Normous.Physics.Twod.PinConstraint, Normous.Physics.Twod.AbstractConstraint);

    Normous.Physics.Twod.PinConstraint.prototype.p1;
    Normous.Physics.Twod.PinConstraint.prototype.position;
    Normous.Physics.Twod.PinConstraint.prototype.broken = false;
    Normous.Physics.Twod.PinConstraint.prototype.breakDistance = 30;
    Normous.Physics.Twod.PinConstraint.prototype.breakable = false;

    Normous.Physics.Twod.PinConstraint.prototype.resolve = function(stepCoefficient) {
		var distance = this.p1.position.distance(this.position);
		if(this.broken) {
   			return;
		}
		if(distance > this.breakDistance) {
			var e = new Normous.Physics.Twod.BreakEvent({
				type: Normous.Physics.Twod.BreakEvent.BREAK,
				constraint: this
			});
			this.dispatchEvent(e);
			this.p1.fixed = false;
			this.broken = true;
		}
		this.p1.position.set(this.position);
    };

    Normous.Physics.Twod.PinConstraint.prototype.init = function() {
        this.cleanup();
        this.paint();
    };

    Normous.Physics.Twod.PinConstraint.prototype.paint = function() {
        this.drawable.paint();
    };

});
