define(function() { 
    QUnit.start();
    /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */
    
    /* require your app components
   * for example, if you have /app/modules/doSomething.js, you can
   * require(['modules/doSomething'], function(theModule) {
   *   // test the things
   * });
   */
    
    module('Normous');
    
    test('is a function', function() {
        expect(1);
        stop();
        define(['Normous'], function($) {
            start();
            strictEqual(typeof Normous, 'function', 'is a function');
        });
    });
    
    test('Inheritance works', function() {
        expect(9);
        stop();
        define(['Normous','normous/Object'], function() {
            var myConfig = {
                test: 'test'
            };
            var InheritanceTest = function(config) {
                this.parent(config);
            };
            
            Normous.Object.inherit(InheritanceTest, Normous.Object);
            InheritanceTest.prototype.testDefaultProperty = 'test';
            InheritanceTest.prototype.testMethod = function() {
                return 'testMethod';
            };
            InheritanceTest.prototype.testOverrideMethod = function() {
                return 'testOverrideMethod';
            };
            
            var test = new InheritanceTest(myConfig);
            
            start();
            strictEqual(typeof test, 'function', 'is a function');
            strictEqual(test.test, 'test', 'constructor inheritance works');
            strictEqual(test.test, 'test', 'parent constructor works.');
            strictEqual(test.clone, 'function', 'method inheritance works.');
            strictEqual(test.testMethod, 'function', 'simple method works.');
            strictEqual(test.testMethod(), 'testMethod', 'simple method');
            
            
            var ChildInheritanceTest = function(config) {
                this.parent(config);
            };
            Normous.Object.inherit(ChildInheritanceTest, InheritanceTest);
            
            ChildInheritanceTest.prototype.testOverrideMethod = function() {
                return 'override';
            };
            
            var testChild = new ChildInheritanceTest({
                test:'testChild'
            });
            
            strictEqual(test.testMethod, 'function', 'method inheritance');
            strictEqual(test.testOverrideMethod, 'function', 'method override is function');
            strictEqual(test.testOverrideMethod(), 'override', 'method override');
            
        });
    });
    
    
    
});
