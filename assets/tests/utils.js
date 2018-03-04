import chai from "chai";
import System from "systemjs";

/**
* Load a module from Systemjs for testing. This should be done before your tests
*
* @usage:
*   let KenoServiceRequest;
*   before(() => loadSystemModule("app/services/Service", (mod) => KenoServiceRequest = mod.KenoServiceRequest));
*   it("should do foo", () = { // can use KenoServiceRequest module here now ...
*/
function loadSystemModule(moduleName, callback) {
    return System.import(moduleName).then(callback);
}

/**
* Load a module from Systemjs for testing using the before() hook. This is same as loadSystemModule()
* but for convenience wraps in before() for you
*
* @usage:
*   let KenoServiceRequest;
*   loadSystemModuleBefore("app/services/Service", (mod) => KenoServiceRequest = mod.KenoServiceRequest);
*   it("should do foo", () = { // can use KenoServiceRequest module here now ...
*/
function loadSystemModuleBefore(moduleName, callback) {
    before(() => loadSystemModule(moduleName, callback));
}

export { loadSystemModule, loadSystemModuleBefore };
