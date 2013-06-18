define([
    'Normous', 'normous/Object'
], function() {
        
    /*global Normous:false */
    Normous.namespace("Normous.Singleton");
    
    Normous.Singleton = function() {};
    Normous.Object.inherit(Normous.Singleton, Normous.Object);
    
    Normous.Singleton._instances = [];
    
    Normous.Singleton.createSingleton = function(ChildClass) {
        ChildClass.getInstance = function() {
            if(ChildClass._instance == null) {
                ChildClass._instance = new ChildClass();
            }
            return ChildClass._instance;
        };
    };

});