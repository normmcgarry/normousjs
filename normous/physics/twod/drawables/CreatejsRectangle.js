define([
	'normous/Object',
	'normous/physics/twod/Drawable'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.Drawables.CreatejsRectangle");
	
	Normous.Physics.Twod.Drawables.CreatejsRectangle = function(config) {
		 var drawableProperties = {
			lineThickness: 1,
			lineColor: "rgba(255,255,255,0.5)",
			fillColor: "rgba(255,255,255,0.2)"
		};
		this._super(config);
		this.drawableProperties = Normous.extend(drawableProperties, config.drawableProperties);
		this.element = new createjs.Shape();
	};
	Normous.Object.inherit(Normous.Physics.Twod.Drawables.CreatejsRectangle, Normous.Physics.Twod.Drawable);

	Normous.Physics.Twod.Drawables.CreatejsRectangle.prototype.drawableProperties;
	Normous.Physics.Twod.Drawables.CreatejsRectangle.prototype.element;
	
	Normous.Physics.Twod.Drawables.CreatejsRectangle.prototype.init = function() {
		//Normous.Logger.log("Normous.Physics.Twod.Drawables.CreatejsRectangle.init()" + this.item.width + " " + this.item.height);
		this.draw();
		this.paint();
	};
	
	Normous.Physics.Twod.Drawables.CreatejsRectangle.prototype.draw = function() {
		var props = this.drawableProperties;
		this.element.graphics.clear();
		this.element.graphics.beginStroke(props.lineColor).beginFill(props.fillColor).setStrokeStyle(props.lineThickness);
		this.element.graphics.drawRect(-this.item.width/2, -this.item.height/2, this.item.width, this.item.height);
		this.element.graphics.endFill();
		this.element.graphics.endStroke();
	};
	Normous.Physics.Twod.Drawables.CreatejsRectangle.prototype.paint = function() {
		this.element.x = this.item.getX();
		this.element.y = this.item.getY();
		this.element.rotation = this.item.getAngle();
	};
	
});