define([
	'normous/physics/twod/RectangleParticle',
	'normous/physics/twod/CircleParticle',
	'normous/math/Utils'
], function() {
	
	Normous.namespace("Normous.Physics.Twod.SpringConstraintParticle");
	
	Normous.Physics.Twod.SpringConstraintParticle = function(config) {
		this.parent(config);
		
		this.lambda = new Normous.Math.Vector2();
		this.averageVelocity = new Normous.Math.Vector2();
		this.rca = new Normous.Math.Vector2();
		this.rcb = new Normous.Math.Vector2();
		this.friction = (this.p1.friction + this.p2.friction) / 2;
		this.elasticity = (this.p1.elasticity + this.p2.elasticity) / 2;
		this.mass = (this.p1.mass + this.p2.mass) / 2;
		this.parent = this.p;
	};
	
	Normous.Object.inherit(Normous.Physics.Twod.SpringConstraintParticle, Normous.Physics.Twod.RectangleParticle);
	
	Normous.Physics.Twod.SpringConstraintParticle.prototype.parent;
	
	Normous.Physics.Twod.SpringConstraintParticle.prototype.p1;
	Normous.Physics.Twod.SpringConstraintParticle.prototype.p2;
	
	
	Normous.Physics.Twod.SpringConstraintParticle.prototype.averageVelocity;
	Normous.Physics.Twod.SpringConstraintParticle.prototype.lambda;
	Normous.Physics.Twod.SpringConstraintParticle.prototype.scaleToLength = true;
	
	Normous.Physics.Twod.SpringConstraintParticle.prototype.rca;
	Normous.Physics.Twod.SpringConstraintParticle.prototype.rcb;
	Normous.Physics.Twod.SpringConstraintParticle.prototype.s = 0;
	
	Normous.Physics.Twod.SpringConstraintParticle.prototype.rectScale;
	Normous.Physics.Twod.SpringConstraintParticle.prototype.rectHeight;
	Normous.Physics.Twod.SpringConstraintParticle.prototype.fixedEndLimit;
	
	Normous.Physics.Twod.SpringConstraintParticle.prototype.getMass = function() {
		return (this.p1.mass + this.p2.mass) / 2;
	};
	
	Normous.Physics.Twod.SpringConstraintParticle.prototype.getVelocity = function() {
		var p1v =  this.p1.getVelocity();
		var p2v =  this.p2.getVelocity();
		
		this.averageVelocity.reset(((p1v.x + p2v.x) / 2), ((p1v.y + p2v.y) / 2));
		return this.averageVelocity;
	};
	
	Normous.Physics.Twod.SpringConstraintParticle.prototype.updatePosition = function() {
		var c = this.parent.getCenter();
		this.position.reset(c.x, c.y);
		
		this.width = (this.scaleToLength) ? 
						this.parent.getPositionLength() * this.rectScale : 
						this.parent.restLength * this.rectScale;
		this.height = this.rectHeight;
		this.radian = this.parent.getRadian();
	};
	
	Normous.Physics.Twod.SpringConstraintParticle.prototype.resolveCollision = function(mtd, vel, n, d, o, p) {
		this.testParticleEvents(p);
		if (this.fixed || ! this.p.solid) return;
		
		var t = this.getContactPointParam(p);
		var c1 = (1 - t);
		var c2 = t;
		
		// if one is fixed then move the other particle the entire way out of 
		// collision. also, dispose of collisions at the sides of the scp. The higher
		// the fixedEndLimit value, the more of the scp not be effected by collision. 
		if (this.p1.fixed) {
			if (c2 <= this.fixedEndLimit) return;
			this.lambda.reset(mtd.x / c2, mtd.y / c2);
			this.p2.position.iadd(lambda);
			this.p2.setVelocity(vel);

		} else if (this.p2.fixed) {
			if (c1 <= this.fixedEndLimit) return;
			this.lambda.reset(mtd.x / c1, mtd.y / c1);
			this.p1.position.iadd(lambda);
			this.p1.setVelocity(vel);

		// else both non fixed - move proportionally out of collision
		} else { 
			var denom = (c1 * c1 + c2 * c2);
			if (denom == 0) return;
			this.lambda.reset(mtd.x / denom, mtd.y / denom);
	
			this.p1.position.iadd(this.lambda.multiply(c1));
			this.p2.position.iadd(this.lambda.multiply(c2));
	
			// if collision is in the middle of SCP set the velocity of both end 
			// particles
			if (t == 0.5) {
				this.p1.setVelocity(vel);
				this.p2.setVelocity(vel);
			
			// otherwise change the velocity of the particle closest to contact
			} else {
				var corrParticle = (t < 0.5) ? this.p1 : this.p2;
				corrParticle.setVelocity(vel);
			}
		}
	};
	
	
	
	Normous.Physics.Twod.SpringConstraintParticle.prototype.closestParamPoint = function(c) {
		var ab = this.p2.position.subtract(this.p1.position);
		var t = (ab.dot(c.subtract(this.p1.position))) / (ab.dot(ab));
		return Normous.Math.Utrils.clamp(t, 0, 1);
	};
	
	
	Normous.Physics.Twod.SpringConstraintParticle.prototype.getContactPointParam = function(p) {
		var t;
		
		if (this.p instanceof Normous.Physics.Twod.CircleParticle)  {
			t = this.closestParamPoint(p.position);
		} 
		else if (this.p instanceof Normous.Physics.Twod.RectangleParticle) {
					
			// go through the sides of the colliding rectangle as line segments
			var shortestIndex;
			var paramList = new Array();
			var shortestDistance = Number.POSITIVE_INFINITY;
			
			for (var i = 0; i < 4; i++) {
				this.setCorners(p, i);
				
				// check for closest points on SCP to side of rectangle
				var d = this.closestPtSegmentSegment();
				if (d < shortestDistance) {
					shortestDistance = d;
					shortestIndex = i;
					paramList[i] = s;
				}
			}
			t = paramList[shortestIndex];
		}
		return t;
	};
	
	Normous.Physics.Twod.SpringConstraintParticle.prototype.setCorners = function(r, i) {
		var rx = r.curr.x;
		var ry = r.curr.y;
		
		var axes = r.axes;
		var extents = r.extents;
		
		var ae0_x = axes[0].x * extents[0];
		var ae0_y = axes[0].y * extents[0];
		var ae1_x = axes[1].x * extents[1];
		var ae1_y = axes[1].y * extents[1];
		
		var emx = ae0_x - ae1_x;
		var emy = ae0_y - ae1_y;
		var epx = ae0_x + ae1_x;
		var epy = ae0_y + ae1_y;
		
		
		if (i == 0) {
			// 0 and 1
			rca.x = rx - epx;
			rca.y = ry - epy;
			rcb.x = rx + emx;
			rcb.y = ry + emy;
		
		} else if (i == 1) {
			// 1 and 2
			rca.x = rx + emx;
			rca.y = ry + emy;
			rcb.x = rx + epx;
			rcb.y = ry + epy;
				
		} else if (i == 2) {
			// 2 and 3
			rca.x = rx + epx;
			rca.y = ry + epy;
			rcb.x = rx - emx;
			rcb.y = ry - emy;
				
		} else if (i == 3) {
			// 3 and 0
			rca.x = rx - emx;
			rca.y = ry - emy;
			rcb.x = rx - epx;
			rcb.y = ry - epy;
		}
	};
	
	Normous.Physics.Twod.SpringConstraintParticle.prototype.closestPtSegmentSegment = function() {
		var pp1 = p1.curr;
		var pq1 = p2.curr;
		var pp2 = rca;
		var pq2 = rcb;
		
		var d1 = pq1.subtract(pp1);
		var d2 = pq2.subtract(pp2);
		var r = pp1.subtract(pp2);

		var t;
		var a = d1.dot(d1);
		var e = d2.dot(d2);
		var f = d2.dot(r);
		
		var c = d1.dot(r);
		var b = d1.dot(d2);
		var denom = a * e - b * b;
		
		if (denom != 0.0) {
			s = Normous.Math.Utils.clamp((b * f - c * e) / denom, 0, 1);
		}
		else {
			s = 0.5 // give the midpoint for parallel lines
		}
		t = (b * s + f) / e;
		 
		if (t < 0) {
			t = 0;
			s = Normous.Math.Utils.clamp(-c / a, 0, 1);
		}
		else if (t > 0) {
			t = 1;
			s = Normous.Math.Utils.clamp((b - c) / a, 0, 1);
		}
		 
		var c1 = pp1.add(d1.multiply(s));
		var c2 = pp2.add(d2.multiply(t));
		var c1mc2 = c1.subtract(c2);
		return c1mc2.dot(c1mc2);
	};
	
	
});