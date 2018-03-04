import chai, { expect } from "chai";
import System from "systemjs";
import { loadSystemModuleBefore } from "../../utils";

describe("KenoCountdownView", () => {

    let KenoCountdownView;
    let Clock;

    loadSystemModuleBefore("app/views/KenoCountdown", (mod) => {
        KenoCountdownView = mod.default;
    });
    loadSystemModuleBefore("app/modules/Clock", (mod) => {
        Clock = mod.default;
    });

    describe("clock formatting", () => {
        it("should return minutes and seconds remaining from a timestamp", () => {
            let view = new KenoCountdownView();
            let expectedMins = 13;
            let expectedSecs = 45;
            let remainingTime = expectedMins * 60 + expectedSecs;
            var { mins, secs } = view.getClockDisplay(remainingTime);
            expect(mins).to.equal(expectedMins);
            expect(secs).to.equal(expectedSecs);

            // 0 minutes
            var { mins, secs } = view.getClockDisplay(59);
            expect(mins).to.equal(0);
            expect(secs).to.equal(59);

            // 0 seconds
            var { mins, secs } = view.getClockDisplay(60);
            expect(mins).to.equal(1);
            expect(secs).to.equal(0);
            var { mins, secs } = view.getClockDisplay(180);
            expect(mins).to.equal(3);
            expect(secs).to.equal(0);

            // 0 time
            var { mins, secs } = view.getClockDisplay(0);
            expect(mins).to.equal(0);
            expect(secs).to.equal(0);
            var { mins, secs } = view.getClockDisplay(-1);
            expect(mins).to.equal(0);
            expect(secs).to.equal(0);

        });
    });

    describe("clock offset", () => {
        it("should default to 0 offset", () => {
            let view = new KenoCountdownView();
            expect(view.getClockOffset()).to.equal(0);
        });

        it("should return correct time in server time when client offset is 0", () => {
            let view = new KenoCountdownView();
            expect(parseInt(view.now(),10)).to.equal(parseInt(Date.now() / 1000, 10));
        });

        it("should return correct time in server time when client offset to future", () => {
            let view = new KenoCountdownView();
            Clock.setClockOffset(30);
            expect(parseInt(view.now(), 10)).to.equal(parseInt((Date.now() / 1000) - 30, 10)); // shave off the microsecs
            Clock.setClockOffset(130);
            expect(parseInt(view.now(), 10)).to.equal(parseInt((Date.now() / 1000) - 130, 10));
        });

        it("should return correct time in server time when client offset to past", () => {
            let view = new KenoCountdownView();
            Clock.setClockOffset(-30);
            expect(parseInt(view.now(), 10)).to.equal(parseInt((Date.now() / 1000) + 30, 10));
            Clock.setClockOffset(-130);
            expect(parseInt(view.now(), 10)).to.equal(parseInt((Date.now() / 1000) + 130, 10));
        });
    });

});
