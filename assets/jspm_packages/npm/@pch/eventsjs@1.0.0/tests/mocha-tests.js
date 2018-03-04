/* */ 
"format cjs";
// see this repo for the basis of this setup: 
// https://github.com/curran/jspm-mocha-example/blob/master/test/tests.js

import "babel-polyfill";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

// load all our tests
import requireDir from "require-dir";
requireDir("./spec/", {recurse: true});
