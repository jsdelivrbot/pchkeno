import chai, { expect } from "chai";
import System from "systemjs";
import { loadSystemModuleBefore } from "../../utils";

describe("DisplayQueue", () => {

    let DisplayQueue;

    loadSystemModuleBefore("app/modules/DisplayQueue", (mod) => {
        DisplayQueue = mod.default;
    });

    describe("isCurrentlyDisplaying", () => {
        it("should return true/false depending on whether displayable is active or not", () => {
            let resolver;
            let promise;
            let displayable = () => {
                promise = new Promise((resolve, reject) => { resolver = resolve; });
                return promise;
            };

            var q = new DisplayQueue();
            expect(q.isCurrentlyDisplaying()).to.equal(false);
            q.enqueue(displayable);
            expect(q.isCurrentlyDisplaying()).to.equal(true);
            promise = promise.then(() => {
                expect(q.isCurrentlyDisplaying()).to.equal(false);
            });
            resolver();
            return promise;
        });

        it("should return true/false depending on whether displayable is active or not for multiple queued", () => {
            let resolvers = [];
            let promises = [];
            let displayable = () => {
                let promise = new Promise((resolve, reject) => { resolvers.push(resolve); });
                promises.push(promise);
                return promise;
            };

            var q = new DisplayQueue();
            q.enqueue(displayable);
            q.enqueue(displayable);
            expect(q.isCurrentlyDisplaying()).to.equal(true);

            // since the promises are async, we need to return 
            // a promise to mocha, which knows to treat tests/fails async
            let doneResolve;
            let doneReject;
            let donePromise = new Promise((resolve, reject) => { 
                doneReject = reject;
                doneResolve = resolve; 
            });
            // execute the first displayable
            promises.shift().then(() => {
                // should still be displaying since we had another displayable
                // queued up
                expect(q.isCurrentlyDisplaying()).to.equal(true);
                // execute the second displayable
                promises.shift().then(() => {
                    // should not be displaying anymore 
                    expect(q.isCurrentlyDisplaying()).to.equal(false);
                    doneResolve();
                }).catch((err) => { doneReject(err); });
                resolvers.shift()();
            }).catch((err) => { doneReject(err); });
            resolvers.shift()();

            // see: http://stackoverflow.com/questions/26571328/how-do-i-properly-test-promises-with-mocha-and-chai
            return donePromise;
        });
    });

    describe("count", () => {
        it("should return the correct number in queue", () => {
            let resolvers = [];
            let displayable = () => {
                return new Promise((resolve, reject) => { resolvers.push(resolve); });
            };

            var q = new DisplayQueue();
            expect(q.count()).to.equal(0);

            // add a displayable
            q.enqueue(displayable);
            // count still 0, since the current one is being displayed
            expect(q.count()).to.equal(0);
            q.enqueue(displayable);
            expect(q.count()).to.equal(1);
        });
    });

    describe("displayAllInSequence", () => {
        it("should display all displayables in sequence", () => {
            // grab a reference to the displayable promises/resolve 
            // so we can manually trigger them to control the flow
            // of our test
            let resolvers = [];
            let promises = [];
            let displayable = () => {
                let promise = new Promise((resolve, reject) => { resolvers.push(resolve); });
                promises.push(promise);
                return promise;
            };

            // since the promises are async, we need to return 
            // a promise to mocha, which knows to treat tests/fails async
            let doneResolve, doneReject;
            let donePromise = new Promise((resolve, reject) => { 
                doneReject = reject;
                doneResolve = resolve; 
            });

            let doneCount = 0;
            let doneCallback = () => {
                doneCount++;
            };

            // display all in sequence should be kicked off as soon as 
            // add the first one
            var q = new DisplayQueue();
            q.enqueue(displayable);
            q.enqueue(displayable);
            q.enqueue(displayable, doneCallback);
            q.addEmptiedCallback(doneCallback);

            // ignore the first displayable
            promises.shift().then(() => {
                // second displayable when run, the queue should
                // still be active
                promises.shift().then(() => {
                    expect(doneCount).to.equal(0);
                    // the last displayable promise should get triggered after the first
                    // 2 promises are resolved
                    promises.shift().then(() => {
                        expect(doneCount).to.equal(2);
                        doneResolve();
                    }).catch((err) => { doneReject(err); });
                    resolvers.shift()();
                }).catch((err) => { doneReject(err); });
                resolvers.shift()();

            }).catch((err) => { doneReject(err); });

            resolvers.shift()();

            return donePromise;
        });
    });

});
