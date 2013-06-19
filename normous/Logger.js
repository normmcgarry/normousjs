define([
    'normous/Normous', 'normous/Object'
], function() {
    /*global Normous:false */
    Normous.namespace('Normous.Logger');
    
    Normous.Logger = function(config) {
        this.parent(config);
    };
    Normous.Object.inherit(Normous.Logger, Normous.Object);
    
    Normous.Logger.log = function(str) {
        if(arguments.length > 1) {
            console.log(arguments);
            return;
        }
        console.log(str);
    };
    
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
});