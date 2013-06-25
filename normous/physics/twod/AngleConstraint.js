define([
    'normous/physics/twod/AbstractConstraint',
    'normous/physics/twod/drawables/CreatejsAngleConstraint',
    'normous/math/Utils'
], function() {

    Normous.namespace("Normous.Physics.Twod.AngleConstraint");


    Normous.Physics.Twod.AngleConstraint = function(config) {
        this.drawable = new Normous.Physics.Twod.Drawables.CreatejsAngleConstraint({item:this, drawableProperties: config.drawableProperties});
        this._super(config);

        this.angle = this.p2.position.angle2(this.p1.position, this.p3.position);
    };

    Normous.Object.inherit(Normous.Physics.Twod.AngleConstraint, Normous.Physics.Twod.AbstractConstraint);

    Normous.Physics.Twod.AngleConstraint.prototype.p1;
    Normous.Physics.Twod.AngleConstraint.prototype.p2;
    Normous.Physics.Twod.AngleConstraint.prototype.p3;
    Normous.Physics.Twod.AngleConstraint.prototype.priority = 0;

    Normous.Physics.Twod.AngleConstraint.prototype.resolve = function(stepCoefficient) {
        var angle = this.p2.position.angle2(this.p1.position, this.p3.position);
        var diff = angle - this.angle;
		var stiffness = this.stiffness;

        if (diff <= -Math.PI) {
            diff += 2*Math.PI;
        }
        else if (diff >= Math.PI) {
            diff -= 2*Math.PI;
        }
		
        diff *= stepCoefficient*stiffness;
		
		/*
        this.p1.position = this.p1.position.rotate(this.p2.position, diff);
        this.p3.position = this.p3.position.rotate(this.p2.position, -diff);
        this.p2.position = this.p2.position.rotate(this.p1.position, diff);
        this.p2.position = this.p2.position.rotate(this.p3.position, -diff);
		*/
		
		if(!this.p1.fixed) {
        	this.p1.position = this.p1.position.rotate(this.p2.position, diff);
		}
		if(!this.p2.fixed) {
			this.p2.position = this.p2.position.rotate(this.p1.position, diff);
        	this.p2.position = this.p2.position.rotate(this.p3.position, -diff);
		}
		if(!this.p3.fixed) {
        	this.p3.position = this.p3.position.rotate(this.p2.position, -diff);
		}
    };

    Normous.Physics.Twod.AngleConstraint.prototype.init = function() {
        this.cleanup();
        this.paint();
    };

    Normous.Physics.Twod.AngleConstraint.prototype.paint = function() {
        this.drawable.paint();
    };

});
