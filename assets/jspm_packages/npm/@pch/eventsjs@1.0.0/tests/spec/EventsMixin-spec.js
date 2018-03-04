/* */ 
"format cjs";
import chai, { expect } from "chai";
import EventsMixin from "../../src/index.js";

describe("EventsMixin", () => {

    it("should fire event listeners", () => {
        let obj = Object.assign({}, EventsMixin);

        let callbackCount = 0;
        let callbackArgs;

        obj.addEvent("foo", function() {
            callbackCount++;
            callbackArgs = arguments;
        });

        obj.fireEvent("foo");
        expect(callbackCount).to.equal(1);
        expect(callbackArgs.length).to.equal(0);

        obj.fireEvent("foo", "bar");
        expect(callbackCount).to.equal(2);
        expect(callbackArgs.length).to.equal(1);
        expect(callbackArgs[0]).to.equal("bar");

        obj.fireEvent("foo", 1, "bar", 3);
        expect(callbackCount).to.equal(3);
        expect(callbackArgs.length).to.equal(3);
        expect(callbackArgs[0]).to.equal(1);
        expect(callbackArgs[1]).to.equal("bar");
        expect(callbackArgs[2]).to.equal(3);

        obj.fireEvent("bar");
        expect(callbackCount).to.equal(3);
    });

    it("should remove event listeners", () => {
        let obj = Object.assign({}, EventsMixin);

        let callbackCount = 0;
        let callbackArgs;

        var myCallback = function() {
            callbackCount++;
            callbackArgs = arguments;
        };
        obj.addEvent("foo", myCallback);

        obj.fireEvent("foo");
        expect(callbackCount).to.equal(1);
        expect(callbackArgs.length).to.equal(0);

        // only removes from correct event name
        obj.removeEvent("bar", myCallback);
        obj.fireEvent("foo");
        expect(callbackCount).to.equal(2);

        // now remove it
        obj.removeEvent("foo", myCallback);
        obj.fireEvent("foo");
        expect(callbackCount).to.equal(2);
    });

    it("should propagate events", () => {
        let obj = Object.assign({}, EventsMixin);
        let obj2 = Object.assign({}, EventsMixin);

        let callbackCount = 0;
        let callbackArgs;

        obj2.addEvent("foo", function() {
            callbackCount++;
            callbackArgs = arguments;
        });

        obj.propagateEvent("foo", obj2);
        obj.fireEvent("foo", "bar");

        expect(callbackCount).to.equal(1);
        expect(callbackArgs.length).to.equal(1);
        expect(callbackArgs[0]).to.equal("bar");
    });
});
