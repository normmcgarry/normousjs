define([
	'normous/Normous'
], function() {
	
	
	Normous.namespace("Normous.Math.Utils");
	
	Normous.Math.Utils = {};
	
	Normous.Math.Utils.ONE_EIGHTY_OVER_PI = 180 / Math.PI;
	Normous.Math.Utils.PI_OVER_ONE_EIGHTY = Math.PI / 180;
	
	Normous.Math.Utils.clamp = function(n, min, max) {
		if(n < min) return min;
		if(n > max) return max;
		return n;
	};
	
	Normous.Math.Utils.sign = function(val) {
		if(val < 0) return -1;
		return 1;
	};
	
});