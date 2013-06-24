define([
	'normous/Object',
	'normous/physics/twod/RectangleParticle',
	'normous/physics/twod/CircleParticle',
	'normous/physics/twod/CollisionResolver',
	'normous/math/Vector2'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.CollisionDetector");
	
	Normous.Physics.Twod.CollisionDetector = function(config) {
		this._super(config);
	};
	Normous.Object.inherit(Normous.Physics.Twod.CollisionDetector, Normous.Object);
	
	/* @type AbstractParticle */
	Normous.Physics.Twod.CollisionDetector.cpa;
	/* @type AbstractParticle */
	Normous.Physics.Twod.CollisionDetector.cpb;
	/* @type Vector2 */
	Normous.Physics.Twod.CollisionDetector.collNormal;
	/* @type BNumber */
	Normous.Physics.Twod.CollisionDetector.collDepth;
	
	
	Normous.Physics.Twod.CollisionDetector.test = function(objA, objB) {
		if (objA.fixed && objB.fixed) return;
		
		if (objA.multisample == 0 && objB.multisample == 0) {
				Normous.Physics.Twod.CollisionDetector.normVsNorm(objA, objB);
										
		} else if (objA.multisample > 0 && objB.multisample == 0) {
				Normous.Physics.Twod.CollisionDetector.sampVsNorm(objA, objB);
				
		} else if (objB.multisample > 0 && objA.multisample == 0) {
				Normous.Physics.Twod.CollisionDetector.sampVsNorm(objB, objA);

		} else if (objA.multisample == objB.multisample) {
				Normous.Physics.Twod.CollisionDetector.sampVsSamp(objA, objB);

		} else {
				Normous.Physics.Twod.CollisionDetector.normVsNorm(objA, objB);
		}
	};
	
	Normous.Physics.Twod.CollisionDetector.normVsNorm = function(objA, objB) {
		objA.sample.set(objA.position);
		objB.sample.set(objB.position);
		if (Normous.Physics.Twod.CollisionDetector.testTypes(objA, objB)) {
				Normous.Physics.Twod.CollisionResolver.resolve(Normous.Physics.Twod.CollisionDetector.cpa, Normous.Physics.Twod.CollisionDetector.cpb, Normous.Physics.Twod.CollisionDetector.collNormal, Normous.Physics.Twod.CollisionDetector.collDepth);
				return true;
		}
		return false;
	};
	
	Normous.Physics.Twod.CollisionDetector.sampVsSamp = function(objA, objB) {
		if (Normous.Physics.Twod.CollisionDetector.normVsNorm(objA,objB)) return;
		
		var s = 1 / (objA.multisample + 1); 
		var t = s;
		
		for (var i = 0; i <= objA.multisample; i++) {
			objA.sample.setTo(objA.previous.x + t * (objA.position.x - objA.previous.x), objA.previous.y + t * (objA.position.y - objA.previous.y));
			objB.sample.setTo(objB.previous.x + t * (objB.position.x - objB.previous.x), objB.previous.y + t * (objB.position.y - objB.previous.y));
			
			if (Normous.Physics.Twod.CollisionDetector.testTypes(objA, objB)) {
					Normous.Physics.Twod.CollisionResolver.resolve(Normous.Physics.Twod.CollisionDetector.cpa, Normous.Physics.Twod.CollisionDetector.cpb, Normous.Physics.Twod.CollisionDetector.collNormal, Normous.Physics.Twod.CollisionDetector.collDepth);
					return;
			}
			t += s;
		}
	};
	
	Normous.Physics.Twod.CollisionDetector.testTypes = function(objA, objB) {
		
		if(objA instanceof Normous.Physics.Twod.RectangleParticle && objB instanceof Normous.Physics.Twod.RectangleParticle) {
			return Normous.Physics.Twod.CollisionDetector.testOBBvsOBB(objA, objB);
		}
		else if(objA instanceof Normous.Physics.Twod.CircleParticle && objB instanceof Normous.Physics.Twod.CircleParticle) {
			return Normous.Physics.Twod.CollisionDetector.testCirclevsCircle(objA, objB);
		}
		else if(objA instanceof Normous.Physics.Twod.RectangleParticle && objB instanceof Normous.Physics.Twod.CircleParticle) {
			return Normous.Physics.Twod.CollisionDetector.testOBBvsCircle(objA, objB);
		}
		else if(objA instanceof Normous.Physics.Twod.CircleParticle && objB instanceof Normous.Physics.Twod.RectangleParticle) {
			return Normous.Physics.Twod.CollisionDetector.testOBBvsCircle(objB, objA);
		}
		
	};
	
	Normous.Physics.Twod.CollisionDetector.testOBBvsOBB = function(objA, objB) {
		var depths = new Array();
		var collDepth = Number.POSITIVE_INFINITY;
		var collNormal = null;
		
		for(var i = 0; i < 2; i++) {
			var axisA = objA.axes[i];
			var depthA = Normous.Physics.Twod.CollisionDetector.testIntervals(objA.getProjection(axisA), objB.getProjection(axisA));
			if(depthA == 0) {
				return false;
			}
			
			var axisB = objB.axes[i];
			var depthB = Normous.Physics.Twod.CollisionDetector.testIntervals(objA.getProjection(axisB), objB.getProjection(axisB));
			if(depthB == 0) {
				return false;
			}
			
			var absA = Math.abs(depthA);
			var absB = Math.abs(depthB);
			
			if(absA < Math.abs(collDepth) || absB < Math.abs(collDepth)) {
				var altb = absA < absB;
				collNormal = altb ? axisA : axisB;
				collDepth = altb ? depthA : depthB;
			}
		}
		
		Normous.Physics.Twod.CollisionDetector.collDepth = collDepth;
		Normous.Physics.Twod.CollisionDetector.collNormal = collNormal;
	};
	
	Normous.Physics.Twod.CollisionDetector.testOBBvsCircle = function(objA, objB) {
		var depths = new Array();
		var collDepth = Number.POSITIVE_INFINITY;
		var collNormal = null;
		
		for(var i = 0; i < 2; i++) {
			var boxAxis = objA.axes[i];
			var depth = Normous.Physics.Twod.CollisionDetector.testIntervals(objA.getProjection(boxAxis), objB.getProjection(boxAxis));
			if(depth == 0) {
				return false;
			}
			
			
			if(Math.abs(depth) < Math.abs(collDepth)) {
				collNormal = boxAxis;
				collDepth = depth;
			}
			depths.push(depth);
		}
		
		var r = objB.radius;
		if(Math.abs(depths[0]) < r && Math.abs(depths[1]) < r) {
			var vertex = Normous.Physics.Twod.CollisionDetector.closestVertexOnOBB(objB.sample, objA);
			collNormal = vertex.subtract(objB.sample);
			var magnititude = collNormal.length();
			collDepth = r - magnititude;
			if(collDepth > 0) {
				collNormal.idivide(magnititude);	
			}
			else {
				return false;
			}
		}
		
		Normous.Physics.Twod.CollisionDetector.cpa = objA;
		Normous.Physics.Twod.CollisionDetector.cpb = objB;
		Normous.Physics.Twod.CollisionDetector.collDepth = collDepth;
		Normous.Physics.Twod.CollisionDetector.collNormal = collNormal;
		return true;
	};
	
	Normous.Physics.Twod.CollisionDetector.testCirclevsCircle = function(objA, objB) {
		var depthX = Normous.Physics.Twod.CollisionDetector.testIntervals(objA.getIntervalX(), objB.getIntervalX());
		if (depthX == 0) return false;
		
		var depthY = Normous.Physics.Twod.CollisionDetector.testIntervals(objA.getIntervalY(), objB.getIntervalY());
		if (depthY == 0) return false;
		
		Normous.Physics.Twod.CollisionDetector.collNormal = objA.sample.subtract(objB.sample);
		var mag = Normous.Physics.Twod.CollisionDetector.collNormal.length();
		Normous.Physics.Twod.CollisionDetector.collDepth = (objA.radius + objB.radius) - mag;
		
		if (Normous.Physics.Twod.CollisionDetector.collDepth > 0) {
				Normous.Physics.Twod.CollisionDetector.collNormal.idivide(mag);
				Normous.Physics.Twod.CollisionDetector.cpa = objA;
				Normous.Physics.Twod.CollisionDetector.cpb = objB;
				return true;
		}
		
		return false;
	};
	
	Normous.Physics.Twod.CollisionDetector.testIntervals = function(intervalA, intervalB) {
		if (intervalA.max < intervalB.min) return 0;
		if (intervalB.max < intervalA.min) return 0;
		
		var lenA = intervalB.max - intervalA.min;
		var lenB = intervalB.min - intervalA.max;
		
		return (Math.abs(lenA) < Math.abs(lenB)) ? lenA : lenB;
	};
	
	Normous.Physics.Twod.CollisionDetector.closestVertexOnOBB = function(p, r) {
		var d = p.subtract(r.sample);
		var q = new Normous.Math.Vector2(r.sample.x, r.sample.y);

		for (var i = 0; i < 2; i++) {
				var dist = d.dot(r.axes[i]);

				if (dist >= 0) dist = r.extents[i];
				else if (dist < 0) dist = -r.extents[i];

				q.iadd(r.axes[i].multiply(dist));
		}
		return q;
	};
	
	
});