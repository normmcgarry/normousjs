define([
	'normous/Object',
	'normous/physics/twod/Drawable'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.Drawables.CreatejsAngleConstraint");
	
	Normous.Physics.Twod.Drawables.CreatejsAngleConstraint = function(config) {
		 var drawableProperties = {
			lineThickness: 1,
			lineColor: "rgba(55,55,55,0.2)",
			fillColor: "rgba(55,55,10,0.2)"
		};
		this._super(config);
		this.drawableProperties = Normous.extend(drawableProperties, config.drawableProperties);
		this.element = new createjs.Shape();
	};
	Normous.Object.inherit(Normous.Physics.Twod.Drawables.CreatejsAngleConstraint, Normous.Physics.Twod.Drawable);

	Normous.Physics.Twod.Drawables.CreatejsAngleConstraint.prototype.drawableProperties;
	Normous.Physics.Twod.Drawables.CreatejsAngleConstraint.prototype.element;
	
	Normous.Physics.Twod.Drawables.CreatejsAngleConstraint.prototype.init = function() {
		this.paint();
	};
	
	Normous.Physics.Twod.Drawables.CreatejsAngleConstraint.prototype.paint = function() {
		//Normous.Logger.log("Normous.Physics.Twod.Drawables.CreatejsAngleConstraint.paint()" + Math.floor(this.item.p1.getX()) + "x" + Math.floor(this.item.p1.getY()) );
		var props = this.drawableProperties;
		this.element.graphics.clear();
		this.element.graphics.beginStroke(props.lineColor).beginFill(props.fillColor).setStrokeStyle(props.lineThickness);
		this.element.graphics.moveTo(this.item.p1.getX(), this.item.p1.getY());
		this.element.graphics.lineTo(this.item.p2.getX(), this.item.p2.getY());
		this.element.graphics.lineTo(this.item.p3.getX(), this.item.p3.getY());
		this.element.graphics.endFill();
		this.element.graphics.endStroke();
	};
	
});