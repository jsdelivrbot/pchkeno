# EventsMixin js

A bare bones pub/sub mixin for js. It adds addEventListener/removeEventListener/fireEvent methods
to any object.

## Usage

```javascript
import EventsMixin from "@pch/eventsjs";

// add the events methods to your own class, or object instance
function MyClass() {};
Object.assign(MyClass.prototype, EventsMixin, {
    someOtherMethod: function() {}
});
var myInstance = new MyClass();

var myListener = function(arg1, arg2) {
    console.log("foo event", arg1, arg2);
};

// subscribe to events
myInstance.addEventListener("foo", myListener);

// trigger events
myInstance.fireEvent("foo", "abcd", 1234); // arg1=abcd, arg2=1234 in above myListener

// remove event listener
myInstance.removeEventListener("foo", myListener);

// propagate events through other objects
var myProxy = Object.assign({}, EventsMixin);
myInstance.propagateEvent("foo", myProxy); // propagate "foo" events through myProxy as well
var myProxyHandler = function(arg1, arg2) { console.log(arguments); };
myProxy.addEventListener("foo", myProxyHandler);
myInstance.fireEvent("foo", "bar", "baz"); // myProxyHandler is called via myProxy

```

## Tests

View the tests under **tests/spec/** for more example usage. 
Run the tests via:
```
npm run test
```
