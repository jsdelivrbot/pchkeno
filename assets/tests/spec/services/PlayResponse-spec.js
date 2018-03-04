import chai, { expect } from "chai";
import System from "systemjs";
import { loadSystemModuleBefore } from "../../utils";

describe("PlayResponse", () => {

    let PlayResponse;

    loadSystemModuleBefore("app/services/Play", (mod) => {
        PlayResponse = mod.PlayResponse;
    });

    describe("next url", () => {
        it("should return next url", () => {
            let r = new PlayResponse({});
            expect(r.nextUrl).to.be.null;

            r = new PlayResponse({next: "/foo"});
            expect(r.nextUrl).to.equal("/foo");

            r = new PlayResponse({next: "foo"});
            expect(r.nextUrl).to.equal("/foo");

            r = new PlayResponse({next: "foo/bar?baz=boz"});
            expect(r.nextUrl).to.equal("/foo/bar?baz=boz");

            r = new PlayResponse({next: "index"});
            expect(r.nextUrl).to.equal("/");

            r = new PlayResponse({next: "/index"});
            expect(r.nextUrl).to.equal("/");

            r = new PlayResponse({next: "http://foo.com/bar"});
            expect(r.nextUrl).to.equal("http://foo.com/bar");
        });
    });

});
