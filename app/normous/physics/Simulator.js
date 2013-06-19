
define([
    'normous/Normous', 'normous/Object', 'normous/math/Vector2'
], function() {
        
    Normous.namespace("Normous.Physics.Simulator");
    
    Normous.Physics.Simulator = function(config) {
        this.registry = new Normous.Physics.ForceRegistry();
        this.composites = [];
        this.globalForces = [];
        this.parent(config);
    };
    Normous.Object.inherit(Normous.Physics.Simulator, Normous.Object);
    
    Normous.Physics.Simulator.prototype.globalForces = null;
    Normous.Physics.Simulator.prototype.composites = null;
    Normous.Physics.Simulator.prototype.steps = 15;
    
    Normous.Physics.Simulator.prototype.width = 0;
    Normous.Physics.Simulator.prototype.height = 0;
    
    Normous.Physics.Simulator.prototype.gravity = new Normous.Math.Vector2({x: 0, y: 0.2});
    Normous.Physics.Simulator.prototype.friction = 0.99;
    Normous.Physics.Simulator.prototype.groundFriction = 0.8;
    
    Normous.Physics.Simulator.prototype.simulate = function() {
        var i, j, c, s, f;
        
        //calcuate velocities and friction and gravity
        for(c = 0; c < this.composites.length; c++) {
            var composite = this.composites[c];
            for(i = 0; i < composite.particles.length; i++) {
                var particle = composite.particles[i];
                //calculate velocity
                var velocity = particle.position.subtract(particle.previous).multiply(this.friction);
                //calculate ground friction
                if(particle.position.y >= this.height - 1 && velocity.length2() > 0.000001) {
                    var m = velocity.length();
                    velocity.x /= m;
                    velocity.y /= m;
                    velocity.imultiply(m*this.groundFriction);
                }
                
                particle.previous = particle.position.clone();
                particle.position.iadd(this.gravity);
                particle.position.iadd(velocity);
            }
        }
        
        var delta = 1/this.steps;
        //relax constraints
        for(c = 0; c < this.composites.length; c++) {
            var composite = this.composites[c];
            for(i = 0; i < this.steps; i++) {
                for(j = 0; j < composite.constraints.length; j++) {
                    var constraint = composite.constraints[j];
                    constraint.relax(delta);
                }
            }
        }
        
        //apply global forces
        for(f = 0 ; f < this.globalForces.length; f++) {
            var force = this.globalForces[f];
            
            for(c = 0; c < this.composites.length; c++) {
                var composite = this.composites[c];
                var particles = composite.particles;
                for (i = 0; i < particles.length; i++) {
                    var particle = particles[i];
                    force.updateForce(particle, delta);
                }
            }
        }
        
        //apply registry forces
        this.registry.update(delta);
        
        // check the bounds
        for(c = 0; c < this.composites.length; c++) {
            var composite = this.composites[c];
            var particles = composite.particles;
            for (i = 0; i < particles.length; i++) {
                var particle = particles[i];
                particle.integrate(delta);
            }
        }
        
        
        // check the bounds
        for(c = 0; c < this.composites.length; c++) {
            var composite = this.composites[c];
            var particles = composite.particles;
            for (i = 0; i < particles.length; i++) {
                var particle = particles[i];
                this._particleBoundCheck(particle);
            }
        }
        
    };
    
    Normous.Physics.Simulator.prototype._particleBoundCheck = function(particle) {
        if (particle.position.y > this.height-1)
            particle.position.y = this.height-1;
    
        if (particle.position.x < 0)
            particle.position.x = 0;
    
        if (particle.position.x > this.width-1)
            particle.position.x = this.width-1;
    };
    
    Normous.Physics.Simulator.prototype.addPoint = function(point) {
        this.points.push(point);
    };
    Normous.Physics.Simulator.prototype.addConstraint = function(constraint) {
        this.constraints.push(constraint);
    };
    Normous.Physics.Simulator.prototype.addComposite = function(composite) {
        this.composites.push(composite);
    };
});