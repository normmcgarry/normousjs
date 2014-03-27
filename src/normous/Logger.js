var Logger = {};
var Utils = require("./Utils");

Logger.log = function(str) {
	if(arguments.length > 1) {
		console.log(arguments);
		return;
	}
	console.log(str);
};

if(Utils.isDefinedAndNotNull(this.window)) {
	if(!window.console) {
		window.console = function() {};
	}
	if(!window.console.log) {
		window.console.log = function() {};
	}
	
	else {
		//Normous.Logger.log = window.console.log;
		if(console.log.bind) {
			Logger.log = console.log.bind(console);
		}
		else {
			Logger.log = window.console.log;
		}
	}
}

module.exports = Logger;