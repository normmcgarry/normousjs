var chai = require("chai");
var assert = chai.assert;
var expect = chai.expect;

var BaseObject = require("../src/normous/BaseObject");

describe("BaseObject", function() {
	
	describe("#inherit", function() {
		
		it("new object should be an instanceof parent object.", function() {
			var TestObject = function() {};
			BaseObject.inherit(TestObject, BaseObject);
			
			var testObject = new TestObject();
			expect(testObject).to.be.instanceof(BaseObject);
		})
		
		it("new object should inherit parent methods", function() {
			
			var ParentObject = function() {};
			BaseObject.inherit(ParentObject, BaseObject);
			ParentObject.prototype.testInheritance = function() {};
			
			var TestObject = function() {};
			BaseObject.inherit(TestObject, ParentObject);
			
			var testObject = new TestObject();
			
			expect(testObject.testInheritance).to.not.be.null;
			
		});
		
		it("new object should inherit parent constructor with super call", function(done) {
			
			var ParentObject = function() {
				done();
			};
			BaseObject.inherit(ParentObject, BaseObject);
			ParentObject.prototype.testInheritance = function() {};
			
			var TestObject = function() {
				this._super();
			};
			BaseObject.inherit(TestObject, ParentObject);
			
			var testObject = new TestObject();
		});
		
		it("properties should apply to child object when passed in", function() {
			
			
			var TestObject = function(config) {
				this._super(config);
			};
			BaseObject.inherit(TestObject, BaseObject);
			
			var testObject = new TestObject({
				a: 'foo'
			});
			
			expect(testObject.a).to.equal('foo');
		});
		
	});
	
	describe("#setRequiredProperties", function() {
		
		var ArgumentError = require("../src/normous/exceptions/ArgumentError");
		
		it("should throw an exception if required properties are missing", function() {
			
			var TestObject = function(config) {
				this._super(config);
			};
			BaseObject.inherit(TestObject, BaseObject);
			BaseObject.setRequiredProperties(TestObject, [
				'a'
			]);
			
			expect(function() {
				var testObject = new TestObject();
			}).to.throw(ArgumentError);
			
		});
		
		it("should not throw an exception if required properties are passed in", function() {
			
			var TestObject = function(config) {
				this._super(config);
			};
			BaseObject.inherit(TestObject, BaseObject);
			BaseObject.setRequiredProperties(TestObject, [
				'foo'
			]);
			
			expect(function() {
				var testObject = new TestObject({
					foo:'bar'
				});
			}).to.not.throw(ArgumentError);
			
		});
		
	});
});

