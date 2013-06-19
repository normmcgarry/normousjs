define([
    'normous/Normous', 'normous/Object', 'normous/events/EventDispatcher'
], function() {
    Normous.namespace("Normous.Mvc.ViewModel");

    Normous.Mvc.ViewModel = function(config) {
        this.parent(config);
    };
    
    Normous.Object.inherit(Normous.Mvc.ViewModel, Normous.Events.EventDispatcher);
    
    Normous.Mvc.ViewModel.prototype.getElement = function() {
        return this.element;
    };
    
    Normous.Mvc.ViewModel.prototype.setElement = function(element) {
        this.element = element;
    };
});