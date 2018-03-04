// see this repo for the basis of this setup: 
// https://github.com/curran/jspm-mocha-example/blob/master/test/tests.js

import "babel-polyfill";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import System from "systemjs";
import "../main-config.js";

chai.use(sinonChai);

// stub/mock some modules that are browser only or shouldnt
// be included in this environment
import "./stubs.js";

// load all our tests
import requireDir from "require-dir";
requireDir("./spec/", {recurse: true});
