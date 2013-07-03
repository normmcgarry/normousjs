define([
	'normous/Object',
	'normous/physics/twod/Drawable'
], function() {
	
	
	Normous.namespace("Normous.Physics.Twod.Drawables.CreatejsCircle");
	
	Normous.Physics.Twod.Drawables.CreatejsCircle = function(config) {
		 var drawableProperties = {
			lineThickness: 1,
			lineColor: "rgba(0,0,0,0.5)",
			fillColor: "rgba(0,0,0,0.5)"
		};
		this._super(config);
		this.drawableProperties = Normous.extend(drawableProperties, config.drawableProperties);
		if(typeof createjs !== "undefined")
			this.element = new createjs.Shape();
	};
	Normous.Object.inherit(Normous.Physics.Twod.Drawables.CreatejsCircle, Normous.Physics.Twod.Drawable);

	Normous.Physics.Twod.Drawables.CreatejsCircle.prototype.drawableProperties;
	Normous.Physics.Twod.Drawables.CreatejsCircle.prototype.element;
	
	Normous.Physics.Twod.Drawables.CreatejsCircle.prototype.init = function() {
		if(this.element == null) {
			return;
		}
		var props = this.drawableProperties;
		this.element.graphics.beginStroke(props.lineColor).beginFill(props.fillColor).setStrokeStyle(props.lineThickness);
		this.element.graphics.drawCircle(0, 0, this.item.radius);
		this.element.graphics.endFill();
		this.element.graphics.endStroke();
		this.paint();
	};
	
	Normous.Physics.Twod.Drawables.CreatejsCircle.prototype.paint = function() {
		if(this.element == null) {
			return;
		}
		//Normous.Logger.log("Normous.Physics.Twod.Drawables.CreatejsCircle.paint()" + Math.floor(this.item.getX()) + "x" + Math.floor(this.item.getY()) );
		this.element.x = this.item.getX();
		this.element.y = this.item.getY();
	};
	
});