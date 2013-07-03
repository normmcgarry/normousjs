define([
    'normous/Normous', 'normous/Object'
], function() {
    /*global Normous:false */
    Normous.namespace('Normous.Logger');
    
    Normous.Logger = function(config) {
        this._super(config);
    };
    Normous.Object.inherit(Normous.Logger, Normous.Object);
    
    Normous.Logger.log = function(str) {
        if(arguments.length > 1) {
            console.log(arguments);
            return;
        }
        console.log(str);
    };
    
	if(self.window !== undefined) {
		if(!window.console) {
			window.console = function() {};
		}
		if(!window.console.log) {
			window.console.log = function() {};
		}
		
		else {
			//Normous.Logger.log = window.console.log;
			if(console.log.bind) {
				Normous.Logger.log = console.log.bind(console);
			}
			else {
				Normous.Logger.log = window.console.log;
			}
		}
	}
	else {
		 Normous.Logger.log = function() {
			var query = new Normous.Concurrency.WorkerQuery({
				methodName: 'log',
				params: arguments
			});
			postMessage(query);
		 };
	}
    
});