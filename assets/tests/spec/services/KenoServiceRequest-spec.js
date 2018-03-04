import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import System from "systemjs";
import { loadSystemModuleBefore } from "../../utils";

chai.use(sinonChai);

describe("KenoServiceRequest", () => {

    let KenoServiceRequest;
    let KenoServiceResponse;
    let METHODS;
    let KenoServiceCache;

    loadSystemModuleBefore("app/services/Service", (mod) => {
        KenoServiceRequest = mod.KenoServiceRequest;
        KenoServiceResponse = mod.KenoServiceResponse;
        METHODS = mod.METHODS;
        KenoServiceCache = mod.KenoServiceCache;
    });

    describe("param formatting", () => {
        it("should format Date instances into atom strings", () => {
            //let d = new Date(1475317200000);
            let d = new Date("Sat Oct 01 2016 06:20:00 GMT-0400 (EDT)");
            let expected = "2016-10-01T06:20:00-04:00";
            expect(KenoServiceRequest.getDateRequestParam(d)).to.equal(expected);
            // strings returns back themselves
            expect(KenoServiceRequest.getDateRequestParam(expected)).to.equal(expected);
        });
    });

    describe("body serialization", () => {
        it("should json stringify POST requests", () => {
            var params = {"foo": "bar", "baz": "boz"};
            var req = new KenoServiceRequest("/foo", METHODS.POST, params);
            var expected = JSON.stringify(params);
            expect(req.serializedBody).to.equal(expected);
        });

        it("should query stringify GET requests", () => {
            var params = {"foo": "bar", "baz": "boz"};
            var req = new KenoServiceRequest("/foo", METHODS.GET, params);
            var expected = "foo=bar&baz=boz";
            expect(req.serializedBody).to.equal(expected);
        });
    });

    describe("caching requests", () => {
        it("should return a hash key for caching", () => {
            var params = {"foo": "bar", "baz": "boz"};
            var path = "/somepath";
            var req = new KenoServiceRequest(path, METHODS.GET, params);
            var hashKey = req.hashKey;
            expect(hashKey).to.be.a('string');
            // hash should include params somewhere in it 
            expect(hashKey).to.contain('baz');
            expect(hashKey).to.contain('boz');
            // should include path
            expect(hashKey).to.contain('somepath');
            // method should affect the hash key as well
            var postReq = new KenoServiceRequest(path, METHODS.POST, params);
            expect(hashKey).to.not.equal(postReq.hashKey);
        });

        it("should optionally store/return cached requests", () => {
            var req = new KenoServiceRequest("/path", METHODS.GET, {"foo":"bar"});
            var storage = {
                setItem: sinon.stub(),
                getItem: sinon.stub().returns(JSON.stringify({body: "thebody", statusCode: 200}))
            };
            var callbackCalledCount = 0;
            var callback = (err, resp) => {
                //expect(storage.getItem).to.have.been.called();
                expect(storage.getItem.calledWith(sinon.match(req.hashKey))).to.equal(true);
                expect(err).to.be.null;
                expect(resp.body).to.equal("thebody");
                expect(resp.statusCode).to.equal(200);
                callbackCalledCount++;
            };
            var returnVal = KenoServiceCache.doCachedRequest(req, callback, KenoServiceResponse, {cacheStorage: storage});
            expect(returnVal).to.equal(true);
            expect(callbackCalledCount).to.equal(1);

            // miss cache
            storage.getItem.returns(undefined);
            returnVal = KenoServiceCache.doCachedRequest(req, callback, KenoServiceResponse, {cacheStorage: storage});
            expect(returnVal).to.equal(false);
            expect(callbackCalledCount).to.equal(1);

            // scoped requests
            var cacheScope = "SCOPE.abcd";
            var cacheScope2 = "SCOPE.1234";
            storage.getItem.withArgs(sinon.match(cacheScope)).returns(undefined);
            storage.getItem.withArgs(sinon.match(cacheScope2)).returns(JSON.stringify({body: "thebody", statusCode: 200}));
            // nothing cached under first scope
            returnVal = KenoServiceCache.doCachedRequest(req, callback, KenoServiceResponse, {cacheStorage: storage, cacheScope: cacheScope});
            expect(returnVal).to.equal(false);
            expect(callbackCalledCount).to.equal(1);
            // somethign is cached under second scope
            returnVal = KenoServiceCache.doCachedRequest(req, callback, KenoServiceResponse, {cacheStorage: storage, cacheScope: cacheScope2});
            expect(returnVal).to.equal(true);
            expect(callbackCalledCount).to.equal(2);
        });

    });
});
