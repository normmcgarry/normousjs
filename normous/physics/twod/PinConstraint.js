define([
    'normous/physics/twod/AbstractConstraint',
    'normous/physics/twod/BreakEvent',
    'normous/physics/twod/drawables/CreatejsPinConstraint',
    'normous/math/Utils'
], function() {

    Normous.namespace("Normous.Physics.Twod.PinConstraint");

    Normous.Physics.Twod.PinConstraint = function(config) {
		this.stiffness = null;
        this.drawable = new Normous.Physics.Twod.Drawables.CreatejsPinConstraint({item:this, drawableProperties: config.drawableProperties});
		this.position = new Normous.Math.Vector2();
		this.broken = false;
        this._super(config);
    };

    Normous.Object.inherit(Normous.Physics.Twod.PinConstraint, Normous.Physics.Twod.AbstractConstraint);

    Normous.Physics.Twod.PinConstraint.prototype.p1;
    Normous.Physics.Twod.PinConstraint.prototype.position;
    Normous.Physics.Twod.PinConstraint.prototype.broken = false;
    Normous.Physics.Twod.PinConstraint.prototype.breakDistance = 30;
    Normous.Physics.Twod.PinConstraint.prototype.breakable = false;
	Normous.Physics.Twod.PinConstraint.TYPE = "Normous.Physics.Twod.PinConstraint";
	

    Normous.Physics.Twod.PinConstraint.prototype.resolve = function(stepCoefficient) {
		var distance = this.p1.position.distance(this.position);
		if(this.broken) {
   			return;
		}
		if(this.breakable && distance > this.breakDistance) {
			var e = new Normous.Physics.Twod.BreakEvent({
				type: Normous.Physics.Twod.BreakEvent.BREAK,
				constraint: this
			});
			this.dispatchEvent(e);
			this.broken = true;
		}
		
		if(this.stiffness != null) {
			var delta = this.p1.position.subtract(this.position);
			var deltaLength = delta.length();
        	var dmds = delta.multiply(this.stiffness * stepCoefficient);
			this.p1.position.isubtract(dmds);
		}
		else {
			this.p1.position.set(this.position);
		}
    };

    Normous.Physics.Twod.PinConstraint.prototype.init = function() {
        this.cleanup();
        this.paint();
    };

    Normous.Physics.Twod.PinConstraint.prototype.paint = function() {
        this.drawable.paint();
    };

    Normous.Physics.Twod.PinConstraint.prototype.serialize = function() {
        var obj = this._super('serialize');
		obj.p1 = this.p1.id;
		obj.position = {x: this.position.x, y: this.position.y };
		obj.broken = this.broken;
		obj.breakDistance = this.breakDistance;
		obj.breakable = this.breakable;
		obj.type = Normous.Physics.Twod.PinConstraint.TYPE;
		
		return obj;
    };

    Normous.Physics.Twod.PinConstraint.prototype.unserialize = function(obj) {
		
		this._super('unserialize', obj);
		this.p1 = Normous.Physics.Twod.GlobalCollection.getParticleById(obj.p1);
		this.position.reset(obj.position.x, obj.position.y);
		this.broken = obj.broken;
		this.breakDistance = obj.breakDistance;
		this.breakable = obj.breakable;
		
	};
	
	
    Normous.Physics.Twod.PinConstraint.prototype.create = function(obj) {
		this._super('create', obj);
		this.p1 = Normous.Physics.Twod.GlobalCollection.getParticleById(obj.p1);
		this.position.reset(obj.position.x, obj.position.y);
		this.broken = obj.broken;
		this.breakDistance = obj.breakDistance;
		this.breakable = obj.breakable;
	};
	
	
	
});
