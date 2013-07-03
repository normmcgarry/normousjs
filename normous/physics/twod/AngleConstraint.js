define([
    'normous/physics/twod/AbstractConstraint',
    'normous/physics/twod/drawables/CreatejsAngleConstraint',
    'normous/math/Utils'
], function() {

    Normous.namespace("Normous.Physics.Twod.AngleConstraint");


    Normous.Physics.Twod.AngleConstraint = function(config) {
		if(config == null) config = {};
        this.drawable = new Normous.Physics.Twod.Drawables.CreatejsAngleConstraint({item:this, drawableProperties: config.drawableProperties});
        this._super(config);

		if(this.p1 && this.p2 && this.p3)
        	this.angle = this.p2.position.angle2(this.p1.position, this.p3.position);
    };

    Normous.Object.inherit(Normous.Physics.Twod.AngleConstraint, Normous.Physics.Twod.AbstractConstraint);

    Normous.Physics.Twod.AngleConstraint.prototype.p1;
    Normous.Physics.Twod.AngleConstraint.prototype.p2;
    Normous.Physics.Twod.AngleConstraint.prototype.p3;
    Normous.Physics.Twod.AngleConstraint.prototype.priority = 0;
    Normous.Physics.Twod.AngleConstraint.TYPE = "Normous.Physics.Twod.AngleConstraint";

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
		
		this.p1.position.irotate(90).iadd(new Normous.Math.Vector2({x:20, y:0}));
		
		
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


    Normous.Physics.Twod.AngleConstraint.prototype.serialize = function() {
		var obj = this._super('serialize');
		obj.p1 = this.p1.id;
		obj.p2 = this.p2.id;
		obj.p3 = this.p3.id;
		obj.angle = this.angle;
		obj.type = Normous.Physics.Twod.AngleConstraint.TYPE;
		
		return obj;
	};
	
    Normous.Physics.Twod.AngleConstraint.prototype.unserialize = function(obj) {
		this._super('unserialize', obj);
		this.p1 = Normous.Physics.Twod.GlobalCollection.getParticleById(obj.p1);
		this.p2 = Normous.Physics.Twod.GlobalCollection.getParticleById(obj.p2);
		this.p3 = Normous.Physics.Twod.GlobalCollection.getParticleById(obj.p3);
		this.angle = obj.angle;
	};
	
    Normous.Physics.Twod.AngleConstraint.prototype.create = function(obj) {
		this._super('create', obj);
		this.p1 = Normous.Physics.Twod.GlobalCollection.getParticleById(obj.p1);
		this.p2 = Normous.Physics.Twod.GlobalCollection.getParticleById(obj.p2);
		this.p3 = Normous.Physics.Twod.GlobalCollection.getParticleById(obj.p3);
		this.angle = obj.angle;
	};
	
});
