import chai, { expect } from "chai";
import System from "systemjs";
import { loadSystemModuleBefore } from "../../utils";

describe("Clock", () => {

    let Clock;

    loadSystemModuleBefore("app/modules/Clock", (mod) => {
        Clock = mod.default;
    });

    describe("clock offset", () => {
        after(() => {
            Clock.setClockOffset(0);
        });

        it("should default to 0 offset", () => {
            expect(Clock.getClockOffset()).to.equal(0);
        });

        it("should return correct time in server time when client offset is 0", () => {
            Clock.setClockOffset(0);
            expect(parseInt(Clock.now(), 10)).to.equal(parseInt(Date.now() / 1000, 10));
        });

        it("should return correct time in server time when client offset to future", () => {
            Clock.setClockOffset(30);
            expect(parseInt(Clock.now(), 10)).to.equal(parseInt((Date.now() / 1000) - 30, 10)); // shave off the microsecs
            Clock.setClockOffset(130);
            expect(parseInt(Clock.now(), 10)).to.equal(parseInt((Date.now() / 1000) - 130, 10));
        });

        it("should return correct time in server time when client offset to past", () => {
            Clock.setClockOffset(-30);
            expect(parseInt(Clock.now(), 10)).to.equal(parseInt((Date.now() / 1000) + 30, 10));
            Clock.setClockOffset(-130);
            expect(parseInt(Clock.now(), 10)).to.equal(parseInt((Date.now() / 1000) + 130, 10));
        });
    });

});
