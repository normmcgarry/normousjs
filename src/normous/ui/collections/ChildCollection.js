var BaseObject = require("../../BaseObject");
var EventDispatcher = require("../../events/EventDispatcher");
var ChildEvent = require("../events/ChildEvent");

/**
 * A collection of child "ViewModel" objects.
 * @constrcutor
 * @extends BaseObject
 */
var ChildCollection = function() {
	this.children = [];
	this._super();
};
BaseObject.inherit(ChildCollection, EventDispatcher);

ChildCollection.prototype.children = null;



/**

 * true if the child exists in the stack.

 * @param {ViewModel} child The child to located
 
 * @return {boolean} If the child exists in the stack.

 */

ChildCollection.prototype.containsChild = function(child) {
	for(var i = 0; i < this.children.length; i++) {
		var testChild = this.children[i];
		if(testChild == child) {
			return true;
		}
	}
	return false;
};


/**

 * Returns the index of the specified index. Returns -1 if the child is not in the stack.

 * @param {ViewModel} child The child to locate

 * @return {number} The index of the child. Or -1 if the child is not fouond.

 */

ChildCollection.prototype.getChildIndex = function(child) {
	for(var i = 0; i < this.children.length; i++) {
		var testChild = this.children[i];
		if(testChild == child) {
			return i;
		}
	}
	return -1;
};


/**

 * Returns the child at the specified index.

 * @param {number} index The index of the child.

 * @return {ViewModel} The child at the index.

 */

ChildCollection.prototype.getChildAt = function(index) {
	if(index >= this.children.length || index < 0) {
		throw new Error("Index is out of bounds.");
	}
	return this.children[index];
};


/**

 * Adds a child to the top of the stack.

 * @param {ViewModel} child The child to add.

 */

ChildCollection.prototype.addChild = function(child) {
	this.children.push(child);
	this.length = this.children.length;
	var e = new ChildEvent({
		child: child,
		index: this.length-1,
		type: ChildEvent.CHILD_ADDED
	});
	this.dispatchEvent(e);
};


/**

 * Removes a child from the stack.

 * @param {ViewModel} child The child to remove.

 */

ChildCollection.prototype.removeChild = function(child) {
	for(var i = 0; i < this.children.length; i++) {
		var testChild = this.children[i];
		if(testChild == child) {
			this.children.splice(i, 1);
			this.length = this.children.length;
			
			var e = new ChildEvent({
				child: child,
				index: i,
				type: ChildEvent.CHILD_REMOVED
			});
			this.dispatchEvent(e);
			
			return;
		}
	}
};


/**

 * Adds a child at the specified index.

 * @param {ViewModel} child, The ViewModel to add to the stack.

 * @param {number} index The index of where to add the child.

 */

ChildCollection.prototype.addChildAt = function(child, index) {
	if(this.containsChild(child)) {
		throw new Error("Child already exists in the collection.");
	}
	this.children.splice(index, 0, child);
	this.length = this.children.length;
	
	var e = new ChildEvent({
		child: child,
		index: index,
		type: ChildEvent.CHILD_ADDED
	});
	this.dispatchEvent(e);

};



/**

 * Removes the child at the specified index.

 * @param {number} index The index of the child to remove.
 

 */

ChildCollection.prototype.removeChildAt = function(index) {
	if(index < 0 || index > this.children.length) {
		throw new Error("Index out of bounds.");
	}
	
	var childrenRemoved = this.children.splice(index, 1);
	this.length = this.children.length;
	
	var e = new ChildEvent({
		child: childrenRemoved[0],
		index: index,
		type: ChildEvent.CHILD_ADDED
	});
	this.dispatchEvent(e);
};


/**

 * Returns the top child on the stack.

 * @return {ViewModel} The top child in the stack.
 
 */

ChildCollection.prototype.getTopChild = function() {
	if(this.children.length == 0) {
		return null;
	}
	return this.children[this.children.length-1];
};


/**

 * Returns the bottom child on the stack.
 
 * @return {ViewModel} the bottom child.

 */

ChildCollection.prototype.getBottomChild = function() {
	if(this.children.length == 0) {
		return null;
	}
	return this.children[0];
};


/**

 * Returns the collection as a primitive array.

 * @return {Array} The collection as a primitive array.
 
 */

ChildCollection.prototype.toArray = function() {
	return this.children.slice();
};

module.exports = ChildCollection;