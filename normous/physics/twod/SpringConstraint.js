define([
    'normous/physics/twod/AbstractConstraint',
    'normous/physics/twod/BreakEvent',
    'normous/physics/twod/drawables/CreatejsConstraint',
    'normous/physics/twod/SpringConstraintParticle',
    'normous/math/Utils'
], function() {

    Normous.namespace("Normous.Physics.Twod.SpringConstraint");


    Normous.Physics.Twod.SpringConstraint = function(config) {
        this.drawable = new Normous.Physics.Twod.Drawables.CreatejsConstraint({item:this, drawableProperties: config.drawableProperties});
        this._super(config);
        this.fixed = (this.p1.fixed && this.p2.fixed);
        this.setCollidable(this.collidable, this.rectHeight, this.rectScale, this.scaleToLength);
    };

    Normous.Object.inherit(Normous.Physics.Twod.SpringConstraint, Normous.Physics.Twod.AbstractConstraint);

    Normous.Physics.Twod.SpringConstraint.prototype.p1;
    Normous.Physics.Twod.SpringConstraint.prototype.p2;
    Normous.Physics.Twod.SpringConstraint.prototype.restLength = 10;
    Normous.Physics.Twod.SpringConstraint.prototype.collidable = false;
    Normous.Physics.Twod.SpringConstraint.prototype.breakable = false;
    Normous.Physics.Twod.SpringConstraint.prototype.breakDistance = null;
    Normous.Physics.Twod.SpringConstraint.prototype.rectHeight = 1;
    Normous.Physics.Twod.SpringConstraint.prototype.rectScale = 1;
    Normous.Physics.Twod.SpringConstraint.prototype.minimumDistance = 10;
    Normous.Physics.Twod.SpringConstraint.prototype.scaleToLength = false;
    Normous.Physics.Twod.SpringConstraint.prototype.scp;

    Normous.Physics.Twod.SpringConstraint.prototype.getAngle = function() {
        return this.getRadian() * Normous.Math.Utils.ONE_EIGHTY_OVER_PI;
    };

    Normous.Physics.Twod.SpringConstraint.prototype.getRadian = function() {
        var d = this.getDelta();
        return Math.atan2(d.y, d.x);
    };

    Normous.Physics.Twod.SpringConstraint.prototype.getCenter = function() {
        return (this.p1.position.add(this.p2.position)).divide(2);
    };

    Normous.Physics.Twod.SpringConstraint.prototype.setRectScale = function(s) {
        if(this.scp == null) {
            return;
        }
        this.scp.rectScale = s;
    };

    Normous.Physics.Twod.SpringConstraint.prototype.getRectScale = function() {
        return this.scp.rectScale;
    };

    Normous.Physics.Twod.SpringConstraint.prototype.getPositionLength = function() {
        return this.p1.position.distance(this.p2.position);
    };

    Normous.Physics.Twod.SpringConstraint.prototype.getRectHeight = function() {
        return this.scp.rectHeight;
    };

    Normous.Physics.Twod.SpringConstraint.prototype.setRectHeight = function(h) {
        return this.scp.rectHeight = h;
    };

    Normous.Physics.Twod.SpringConstraint.prototype.getFixedEndLimit = function() {
        return this.scp.fixedEndLimit;
    };

    Normous.Physics.Twod.SpringConstraint.prototype.setFixedEndLimit = function(f) {
        this.scp.fixedEndLimit = f;
    };

    Normous.Physics.Twod.SpringConstraint.prototype.setCollidable = function(b, rectHeight, rectScale, scaleToLength) {
        this.collidable = b;
        this.scp = null;
        if(this.collidable) {
            this.scp = new Normous.Physics.Twod.SpringConstraintParticle({p1: this.p1, p2: this.p2, p: this, rectHeight:rectHeight, rectScale: rectScale, scaleToLength: scaleToLength});
        }
    };

    Normous.Physics.Twod.SpringConstraint.prototype.isConnectedTo = function(p) {
        return (p == this.p1 || p == this.p2);
    };

    Normous.Physics.Twod.SpringConstraint.prototype.init = function() {
        this.cleanup();
        if(this.collidable) {
            this.scp.init();
        }
        this.paint();
    };

    Normous.Physics.Twod.SpringConstraint.prototype.paint = function() {
        this.drawable.paint();
        if(this.collidable) {
            this.scp.paint();
        }
        else {
        }
    };
	
    Normous.Physics.Twod.SpringConstraint.prototype.resolve = function(stepCoefficient) {
        if(this.p1.fixed && this.p2.fixed) return;

		var stiffness = this.stiffness;
        var delta = this.getDelta();
        var deltaLength = delta.length();
		
        var diff = (deltaLength - this.restLength) / (deltaLength);
		
		if(this.breakable) {
			Normous.Logger.log(diff);
			if(diff > this.breakDistance) {
				var e = new Normous.Physics.Twod.BreakEvent({
					type: Normous.Physics.Twod.BreakEvent.BREAK,
					target: this,
					constraint: this
				});
				this.dispatchEvent(e);
				if(this.parent) {
					this.parent.removeConstraint(this);
				}
			}
		}
		
        var dmds = delta.multiply(diff * stiffness * stepCoefficient);

		if(!this.p1.fixed) {
			this.p1.position.isubtract(dmds);
		}
		if(!this.p2.fixed) {
        	this.p2.position.iadd(dmds);
		}
    };

    Normous.Physics.Twod.SpringConstraint.prototype.getDelta = function() {
        return this.p1.position.subtract(this.p2.position);
    };

    Normous.Physics.Twod.SpringConstraint.prototype.checkParticlesLocation = function() {
        if (this.p1.position.x == this.p2.position.x && this.p1.position.y == this.p2.position.y) {
            this.p2.position.x += 0.0001;
        }
    };
});
