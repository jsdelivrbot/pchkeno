import chai, { expect } from "chai";
import System from "systemjs";
import { loadSystemModuleBefore } from "../../utils";

describe("AppModel", () => {

    let AppModel;

    loadSystemModuleBefore("app/models/App", (mod) => {
        AppModel = mod.default;
    });

    describe("proxying", () => {

        it("should get/set properties", () => {
            let myApp = AppModel.create({});

            myApp.completedCardNumber = 1;
            expect(myApp.completedCardNumber).to.equal(1);

            expect(myApp.unlockedCardNumber).to.be.undefined;
            myApp.unlockedCardNumber = 2;
            expect(myApp.unlockedCardNumber).to.equal(2);

            expect(myApp.cashTime).to.be.undefined;
            myApp.cashTime = false;
            expect(myApp.cashTime).to.equal(false);

            expect(myApp.gameTimestampId).to.be.undefined;
            myApp.gameTimestampId = 123;
            expect(myApp.gameTimestampId).to.equal(123);

            expect(myApp.gameEnd).to.be.undefined;
            myApp.gameEnd = 345;
            expect(myApp.gameEnd).to.equal(345);

            expect(myApp.countdownEnd).to.be.undefined;
            myApp.countdownEnd = "foo";
            expect(myApp.countdownEnd).to.equal("foo");

            myApp = AppModel.create({
                completedCardNumber: 1,
                cashTime: true
            });
            expect(myApp.completedCardNumber).to.equal(1);
            expect(myApp.cashTime).to.equal(true);
        });

        it("should fire add events for setter properties", () => {
            let myApp = AppModel.create({});
            let eventFireCount = 0;
            let eventPropName;
            let eventPropVal;

            function expectEvent(count, propName, propVal) {
                expect(eventFireCount).to.equal(count);
                if(propName !== undefined) { expect(eventPropName).to.equal(propName); }
                if(propVal !== undefined) { expect(eventPropVal).to.equal(propVal); }
            }

            myApp.addEvent(myApp.EVENTS.STATE_ADD, (propName, propVal) => { 
                eventFireCount++; 
                eventPropName = propName;
                eventPropVal = propVal;
            });

            myApp.completedCardNumber = 1;
            expectEvent(1, "completedCardNumber", 1);
            myApp.completedCardNumber = 1;
            expectEvent(1);
            myApp.completedCardNumber = 2; // change not an add
            expectEvent(1);

            myApp.unlockedCardNumber = 2;
            expectEvent(2, "unlockedCardNumber", 2);

            myApp.cashTime = false;
            expectEvent(3, "cashTime", false);

            myApp.gameTimestampId = 12345;
            expectEvent(4, "gameTimestampId", 12345);

            myApp.gameEnd = 45657;
            expectEvent(5, "gameEnd", 45657);

            myApp.countdownEnd = 789;
            expectEvent(6, "countdownEnd", 789);

            myApp.currentUser = {name: "Bob"};
            expectEvent(7, "currentUser");
        });

        it("should fire change events for existing properties", () => {
            let myApp = AppModel.create({
                completedCardNumber: 1,
                gameTimestampId: 12345,
                gameEnd: 456,
                countdownEnd: 789
            });
            let eventFireCount = 0;
            let eventPropName;
            let eventPropVal;

            function expectEvent(count, propName, propVal) {
                expect(eventFireCount).to.equal(count);
                if(propName !== undefined) { expect(eventPropName).to.equal(propName); }
                if(propVal !== undefined) { expect(eventPropVal).to.equal(propVal); }
            }

            myApp.addEvent(myApp.EVENTS.STATE_CHANGE, (propName, propVal) => { 
                eventFireCount++; 
                eventPropName = propName;
                eventPropVal = propVal;
            });

            myApp.unlockedCardNumber = 2; // new prop, not a change
            expectEvent(0);
            myApp.unlockedCardNumber = 2; // not a change, same val
            expectEvent(0);
            myApp.unlockedCardNumber = 3; // changed finally
            expectEvent(1, "unlockedCardNumber", 3);

            myApp.cashTime = 123; // new prop
            expectEvent(1);
            myApp.cashTime = 456;
            expectEvent(2, "cashTime", 456);

            myApp.completedCardNumer = 1;
            expectEvent(2);
            myApp.completedCardNumber = 2;
            expectEvent(3, "completedCardNumber", 2);

            myApp.gameTimestampId = 999;
            expectEvent(4, "gameTimestampId", 999);

            myApp.gameEnd = 888;
            expectEvent(5, "gameEnd", 888);

            myApp.countdownEnd = 777;
            expectEvent(6, "countdownEnd", 777);
        });

        it("should fire ad complete events", () => {
            let myApp = AppModel.create({});
            let eventFireCount = 0;
            myApp.addEvent(myApp.EVENTS.AD_COMPLETE, () => {
                eventFireCount++;
            });

            myApp.isAdPlaying = false;
            expect(eventFireCount).to.equal(0);
            myApp.isAdPlaying = true;
            expect(eventFireCount).to.equal(0);
            myApp.isAdPlaying = false;
            expect(eventFireCount).to.equal(1);
            myApp.isAdPlaying = false;
            expect(eventFireCount).to.equal(1);

            myApp = AppModel.create({isAdPlaying: true});
            myApp.addEvent(myApp.EVENTS.AD_COMPLETE, () => {
                eventFireCount++;
            });
            myApp.isAdPlaying = false;
            expect(eventFireCount).to.equal(2);
        });

        it("should return global vals by dot name", () => {
            let myApp = AppModel.create({});
            expect(myApp.getGlobal("foo")).to.be.undefined;
            expect(myApp.getGlobal("foo", "default")).to.equal("default");
            expect(myApp.getGlobal("foo.bar")).to.be.undefined;
            expect(myApp.getGlobal("foo.bar", "baz")).to.equal("baz");

            myApp = AppModel.create({
                GLOBALS: {
                    PCH: {
                        foo: "bar",
                        baz: {
                            a: "val1",
                            b: "val2"
                        }
                    },
                    KENO: {
                        foo: "kenofoo"
                    }
                }
            });
            expect(myApp.getGlobal("foo")).to.be.undefined;
            expect(myApp.getGlobal("PCH.foo")).to.equal("bar");
            expect(myApp.getGlobal("PCH.foo.bar")).to.be.undefined;
            expect(myApp.getGlobal("PCH.baz.a")).to.equal("val1");
            expect(myApp.getGlobal("KENO.foo")).to.equal("kenofoo");
        });

    });

});
