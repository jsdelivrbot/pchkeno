import chai, { expect } from "chai";
import System from "systemjs";
import { loadSystemModuleBefore } from "../../utils";

describe("ChoicesView", () => {

    let ChoicesView;

    loadSystemModuleBefore("app/views/Choices", (mod) => {
        ChoicesView = mod.default;
    });

    describe("hasEnoughTimeToPlay", () => {
        it("should return true/false based on seconds remaining", () => {
            let view = new ChoicesView();
            // default
            expect(view.hasEnoughTimeToPlay()).to.equal(false);
            expect(view.hasEnoughTimeToPlay(90)).to.equal(true);

            // set amount and check
            view.setMinTimeRequired(30);
            expect(view.hasEnoughTimeToPlay(90)).to.equal(true);
            expect(view.hasEnoughTimeToPlay(30)).to.equal(true);
            expect(view.hasEnoughTimeToPlay(29)).to.equal(false);
            expect(view.hasEnoughTimeToPlay(0)).to.equal(false);
        });
    });

});
