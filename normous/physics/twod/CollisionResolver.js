define([
	'normous/Normous',
	'normous/math/Utils'
], function() {
	
	Normous.namespace("Normous.Physics.Twod.CollisionResolver");
	
	Normous.Physics.Twod.CollisionResolver.resolve = function(pa, pb, normal, depth) {
		var mtd = normal.multiply(depth);
		var te = pa.elasticity + pb.elasticity;
		var sumInvMass = pa.getInverseMass() + pb.getInverseMass();
		
		// the total friction in a collision is combined but clamped to [0,1]
		var tf = Normous.Math.Utils.clamp(1 - (pa.friction + pb.friction), 0, 1);
		
		// get the collision components, vn and vt
		var ca = pa.getComponents(normal);
		var cb = pb.getComponents(normal);
		
		 // calculate the coefficient of restitution as the normal component
		var vnA = (cb.vn.multiply((te + 1) * pa.getInverseMass()).add(
					ca.vn.multiply(pb.getInverseMass() - te * pa.getInverseMass()))).divide(sumInvMass);
		var vnB = (ca.vn.multiply((te + 1) * pb.getInverseMass()).add(
					cb.vn.multiply(pa.getInverseMass() - te * pb.getInverseMass()))).divide(sumInvMass);
		
		// apply friction to the tangental component
		ca.vt.imultiply(tf);
		cb.vt.imultiply(tf);
		
		// scale the mtd by the ratio of the masses. heavier particles move less 
		var mtdA = mtd.multiply( pa.getInverseMass() / sumInvMass);     
		var mtdB = mtd.multiply(-pb.getInverseMass() / sumInvMass);
		
		// add the tangental component to the normal component for the new velocity 
		vnA.iadd(ca.vt);
		vnB.iadd(cb.vt);
		
		pa.resolveCollision(mtdA, vnA, normal, depth, -1, pb);
		pb.resolveCollision(mtdB, vnB, normal, depth,  1, pa);
	};
	
});