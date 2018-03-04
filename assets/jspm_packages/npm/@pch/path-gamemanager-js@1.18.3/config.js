/* */ 
(function(process) {
  "use strict";
  System.config({
    baseURL: "./src",
    defaultJSExtensions: true,
    transpiler: "babel",
    babelOptions: {"optional": ["runtime", "optimisation.modules.system"]},
    paths: {
      "github:*": "jspm_packages/github/*",
      "npm:*": "jspm_packages/npm/*"
    },
    map: {
      "@pch/eventsjs": "npm:@pch/eventsjs@1.0.0",
      "babel": "npm:babel-core@5.8.38",
      "babel-runtime": "npm:babel-runtime@5.8.38",
      "core-js": "npm:core-js@1.2.7",
      "github:jspm/nodelibs-assert@0.1.0": {"assert": "npm:assert@1.4.1"},
      "github:jspm/nodelibs-buffer@0.1.1": {"buffer": "npm:buffer@5.0.6"},
      "github:jspm/nodelibs-constants@0.1.0": {"constants-browserify": "npm:constants-browserify@0.0.1"},
      "github:jspm/nodelibs-crypto@0.1.0": {"crypto-browserify": "npm:crypto-browserify@3.11.0"},
      "github:jspm/nodelibs-events@0.1.1": {"events": "npm:events@1.0.2"},
      "github:jspm/nodelibs-http@1.7.1": {
        "Base64": "npm:Base64@0.2.1",
        "events": "github:jspm/nodelibs-events@0.1.1",
        "inherits": "npm:inherits@2.0.1",
        "stream": "github:jspm/nodelibs-stream@0.1.0",
        "url": "github:jspm/nodelibs-url@0.1.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "github:jspm/nodelibs-https@0.1.0": {"https-browserify": "npm:https-browserify@0.0.0"},
      "github:jspm/nodelibs-net@0.1.2": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "http": "github:jspm/nodelibs-http@1.7.1",
        "net": "github:jspm/nodelibs-net@0.1.2",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "stream": "github:jspm/nodelibs-stream@0.1.0",
        "timers": "github:jspm/nodelibs-timers@0.1.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "github:jspm/nodelibs-os@0.1.0": {"os-browserify": "npm:os-browserify@0.1.2"},
      "github:jspm/nodelibs-path@0.1.0": {"path-browserify": "npm:path-browserify@0.0.0"},
      "github:jspm/nodelibs-process@0.1.2": {"process": "npm:process@0.11.10"},
      "github:jspm/nodelibs-punycode@0.1.0": {"punycode": "npm:punycode@1.4.1"},
      "github:jspm/nodelibs-querystring@0.1.0": {"querystring": "npm:querystring@0.2.0"},
      "github:jspm/nodelibs-stream@0.1.0": {"stream-browserify": "npm:stream-browserify@1.0.0"},
      "github:jspm/nodelibs-string_decoder@0.1.0": {"string_decoder": "npm:string_decoder@0.10.31"},
      "github:jspm/nodelibs-timers@0.1.0": {"timers-browserify": "npm:timers-browserify@1.4.2"},
      "github:jspm/nodelibs-tty@0.1.0": {"tty-browserify": "npm:tty-browserify@0.0.0"},
      "github:jspm/nodelibs-url@0.1.0": {"url": "npm:url@0.10.3"},
      "github:jspm/nodelibs-util@0.1.0": {"util": "npm:util@0.10.3"},
      "github:jspm/nodelibs-vm@0.1.0": {"vm-browserify": "npm:vm-browserify@0.0.4"},
      "github:jspm/nodelibs-zlib@0.1.0": {"browserify-zlib": "npm:browserify-zlib@0.1.4"},
      "npm:@pch/eventsjs@1.0.0": {
        "babel-cli": "npm:babel-cli@6.24.1",
        "babel-preset-es2015": "npm:babel-preset-es2015@6.24.1"
      },
      "npm:ajv@4.11.8": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "co": "npm:co@4.6.0",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "json-stable-stringify": "npm:json-stable-stringify@1.0.1",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "punycode": "github:jspm/nodelibs-punycode@0.1.0",
        "querystring": "github:jspm/nodelibs-querystring@0.1.0",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2",
        "url": "github:jspm/nodelibs-url@0.1.0"
      },
      "npm:anymatch@1.3.0": {
        "arrify": "npm:arrify@1.0.1",
        "micromatch": "npm:micromatch@2.3.11",
        "path": "github:jspm/nodelibs-path@0.1.0"
      },
      "npm:are-we-there-yet@1.1.4": {
        "delegates": "npm:delegates@1.0.0",
        "events": "github:jspm/nodelibs-events@0.1.1",
        "readable-stream": "npm:readable-stream@2.2.9",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:arr-diff@2.0.0": {"arr-flatten": "npm:arr-flatten@1.0.3"},
      "npm:asn1.js@4.9.1": {
        "bn.js": "npm:bn.js@4.11.6",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "inherits": "npm:inherits@2.0.1",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
        "vm": "github:jspm/nodelibs-vm@0.1.0"
      },
      "npm:asn1@0.2.3": {
        "assert": "github:jspm/nodelibs-assert@0.1.0",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "sys": "github:jspm/nodelibs-util@0.1.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:assert-plus@0.2.0": {
        "assert": "github:jspm/nodelibs-assert@0.1.0",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "stream": "github:jspm/nodelibs-stream@0.1.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:assert-plus@1.0.0": {
        "assert": "github:jspm/nodelibs-assert@0.1.0",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "stream": "github:jspm/nodelibs-stream@0.1.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:assert@1.4.1": {
        "assert": "github:jspm/nodelibs-assert@0.1.0",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "util": "npm:util@0.10.3"
      },
      "npm:asynckit@0.4.0": {
        "assert": "github:jspm/nodelibs-assert@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "stream": "github:jspm/nodelibs-stream@0.1.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:aws-sign2@0.6.0": {
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "url": "github:jspm/nodelibs-url@0.1.0"
      },
      "npm:aws4@1.6.0": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "querystring": "github:jspm/nodelibs-querystring@0.1.0",
        "url": "github:jspm/nodelibs-url@0.1.0"
      },
      "npm:babel-cli@6.24.1": {
        "babel-core": "npm:babel-core@6.24.1",
        "babel-polyfill": "npm:babel-polyfill@6.23.0",
        "babel-register": "npm:babel-register@6.24.1",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "child_process": "github:jspm/nodelibs-child_process@0.1.0",
        "chokidar": "npm:chokidar@1.7.0",
        "commander": "npm:commander@2.9.0",
        "convert-source-map": "npm:convert-source-map@1.5.0",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "fs-readdir-recursive": "npm:fs-readdir-recursive@1.0.0",
        "glob": "npm:glob@7.1.1",
        "lodash": "npm:lodash@4.17.4",
        "module": "github:jspm/nodelibs-module@0.1.0",
        "output-file-sync": "npm:output-file-sync@1.1.2",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "path-is-absolute": "npm:path-is-absolute@1.0.1",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "repl": "github:jspm/nodelibs-repl@0.1.0",
        "slash": "npm:slash@1.0.0",
        "source-map": "npm:source-map@0.5.6",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2",
        "util": "github:jspm/nodelibs-util@0.1.0",
        "v8flags": "npm:v8flags@2.1.1",
        "vm": "github:jspm/nodelibs-vm@0.1.0"
      },
      "npm:babel-code-frame@6.22.0": {
        "chalk": "npm:chalk@1.1.3",
        "esutils": "npm:esutils@2.0.2",
        "js-tokens": "npm:js-tokens@3.0.1"
      },
      "npm:babel-core@6.24.1": {
        "babel-code-frame": "npm:babel-code-frame@6.22.0",
        "babel-generator": "npm:babel-generator@6.24.1",
        "babel-helpers": "npm:babel-helpers@6.24.1",
        "babel-messages": "npm:babel-messages@6.23.0",
        "babel-register": "npm:babel-register@6.24.1",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-template": "npm:babel-template@6.24.1",
        "babel-traverse": "npm:babel-traverse@6.24.1",
        "babel-types": "npm:babel-types@6.24.1",
        "babylon": "npm:babylon@6.17.1",
        "convert-source-map": "npm:convert-source-map@1.5.0",
        "debug": "npm:debug@2.6.7",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "json5": "npm:json5@0.5.1",
        "lodash": "npm:lodash@4.17.4",
        "minimatch": "npm:minimatch@3.0.4",
        "module": "github:jspm/nodelibs-module@0.1.0",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "path-is-absolute": "npm:path-is-absolute@1.0.1",
        "private": "npm:private@0.1.7",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "slash": "npm:slash@1.0.0",
        "source-map": "npm:source-map@0.5.6",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:babel-generator@6.24.1": {
        "babel-messages": "npm:babel-messages@6.23.0",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-types": "npm:babel-types@6.24.1",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "detect-indent": "npm:detect-indent@4.0.0",
        "jsesc": "npm:jsesc@1.3.0",
        "lodash": "npm:lodash@4.17.4",
        "source-map": "npm:source-map@0.5.6",
        "trim-right": "npm:trim-right@1.0.1"
      },
      "npm:babel-helper-call-delegate@6.24.1": {
        "babel-helper-hoist-variables": "npm:babel-helper-hoist-variables@6.24.1",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-traverse": "npm:babel-traverse@6.24.1",
        "babel-types": "npm:babel-types@6.24.1"
      },
      "npm:babel-helper-define-map@6.24.1": {
        "babel-helper-function-name": "npm:babel-helper-function-name@6.24.1",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-types": "npm:babel-types@6.24.1",
        "lodash": "npm:lodash@4.17.4"
      },
      "npm:babel-helper-function-name@6.24.1": {
        "babel-helper-get-function-arity": "npm:babel-helper-get-function-arity@6.24.1",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-template": "npm:babel-template@6.24.1",
        "babel-traverse": "npm:babel-traverse@6.24.1",
        "babel-types": "npm:babel-types@6.24.1"
      },
      "npm:babel-helper-get-function-arity@6.24.1": {
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-types": "npm:babel-types@6.24.1"
      },
      "npm:babel-helper-hoist-variables@6.24.1": {
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-types": "npm:babel-types@6.24.1"
      },
      "npm:babel-helper-optimise-call-expression@6.24.1": {
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-types": "npm:babel-types@6.24.1"
      },
      "npm:babel-helper-regex@6.24.1": {
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-types": "npm:babel-types@6.24.1",
        "lodash": "npm:lodash@4.17.4"
      },
      "npm:babel-helper-replace-supers@6.24.1": {
        "babel-helper-optimise-call-expression": "npm:babel-helper-optimise-call-expression@6.24.1",
        "babel-messages": "npm:babel-messages@6.23.0",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-template": "npm:babel-template@6.24.1",
        "babel-traverse": "npm:babel-traverse@6.24.1",
        "babel-types": "npm:babel-types@6.24.1"
      },
      "npm:babel-helpers@6.24.1": {
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-template": "npm:babel-template@6.24.1"
      },
      "npm:babel-messages@6.23.0": {
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:babel-plugin-check-es2015-constants@6.22.0": {"babel-runtime": "npm:babel-runtime@6.23.0"},
      "npm:babel-plugin-transform-es2015-arrow-functions@6.22.0": {"babel-runtime": "npm:babel-runtime@6.23.0"},
      "npm:babel-plugin-transform-es2015-block-scoped-functions@6.22.0": {"babel-runtime": "npm:babel-runtime@6.23.0"},
      "npm:babel-plugin-transform-es2015-block-scoping@6.24.1": {
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-template": "npm:babel-template@6.24.1",
        "babel-traverse": "npm:babel-traverse@6.24.1",
        "babel-types": "npm:babel-types@6.24.1",
        "lodash": "npm:lodash@4.17.4"
      },
      "npm:babel-plugin-transform-es2015-classes@6.24.1": {
        "babel-helper-define-map": "npm:babel-helper-define-map@6.24.1",
        "babel-helper-function-name": "npm:babel-helper-function-name@6.24.1",
        "babel-helper-optimise-call-expression": "npm:babel-helper-optimise-call-expression@6.24.1",
        "babel-helper-replace-supers": "npm:babel-helper-replace-supers@6.24.1",
        "babel-messages": "npm:babel-messages@6.23.0",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-template": "npm:babel-template@6.24.1",
        "babel-traverse": "npm:babel-traverse@6.24.1",
        "babel-types": "npm:babel-types@6.24.1"
      },
      "npm:babel-plugin-transform-es2015-computed-properties@6.24.1": {
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-template": "npm:babel-template@6.24.1"
      },
      "npm:babel-plugin-transform-es2015-destructuring@6.23.0": {"babel-runtime": "npm:babel-runtime@6.23.0"},
      "npm:babel-plugin-transform-es2015-duplicate-keys@6.24.1": {
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-types": "npm:babel-types@6.24.1"
      },
      "npm:babel-plugin-transform-es2015-for-of@6.23.0": {"babel-runtime": "npm:babel-runtime@6.23.0"},
      "npm:babel-plugin-transform-es2015-function-name@6.24.1": {
        "babel-helper-function-name": "npm:babel-helper-function-name@6.24.1",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-types": "npm:babel-types@6.24.1"
      },
      "npm:babel-plugin-transform-es2015-literals@6.22.0": {"babel-runtime": "npm:babel-runtime@6.23.0"},
      "npm:babel-plugin-transform-es2015-modules-amd@6.24.1": {
        "babel-plugin-transform-es2015-modules-commonjs": "npm:babel-plugin-transform-es2015-modules-commonjs@6.24.1",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-template": "npm:babel-template@6.24.1"
      },
      "npm:babel-plugin-transform-es2015-modules-commonjs@6.24.1": {
        "babel-plugin-transform-strict-mode": "npm:babel-plugin-transform-strict-mode@6.24.1",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-template": "npm:babel-template@6.24.1",
        "babel-types": "npm:babel-types@6.24.1",
        "path": "github:jspm/nodelibs-path@0.1.0"
      },
      "npm:babel-plugin-transform-es2015-modules-systemjs@6.24.1": {
        "babel-helper-hoist-variables": "npm:babel-helper-hoist-variables@6.24.1",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-template": "npm:babel-template@6.24.1"
      },
      "npm:babel-plugin-transform-es2015-modules-umd@6.24.1": {
        "babel-plugin-transform-es2015-modules-amd": "npm:babel-plugin-transform-es2015-modules-amd@6.24.1",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-template": "npm:babel-template@6.24.1",
        "path": "github:jspm/nodelibs-path@0.1.0"
      },
      "npm:babel-plugin-transform-es2015-object-super@6.24.1": {
        "babel-helper-replace-supers": "npm:babel-helper-replace-supers@6.24.1",
        "babel-runtime": "npm:babel-runtime@6.23.0"
      },
      "npm:babel-plugin-transform-es2015-parameters@6.24.1": {
        "babel-helper-call-delegate": "npm:babel-helper-call-delegate@6.24.1",
        "babel-helper-get-function-arity": "npm:babel-helper-get-function-arity@6.24.1",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-template": "npm:babel-template@6.24.1",
        "babel-traverse": "npm:babel-traverse@6.24.1",
        "babel-types": "npm:babel-types@6.24.1"
      },
      "npm:babel-plugin-transform-es2015-shorthand-properties@6.24.1": {
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-types": "npm:babel-types@6.24.1"
      },
      "npm:babel-plugin-transform-es2015-spread@6.22.0": {"babel-runtime": "npm:babel-runtime@6.23.0"},
      "npm:babel-plugin-transform-es2015-sticky-regex@6.24.1": {
        "babel-helper-regex": "npm:babel-helper-regex@6.24.1",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-types": "npm:babel-types@6.24.1"
      },
      "npm:babel-plugin-transform-es2015-template-literals@6.22.0": {"babel-runtime": "npm:babel-runtime@6.23.0"},
      "npm:babel-plugin-transform-es2015-typeof-symbol@6.23.0": {"babel-runtime": "npm:babel-runtime@6.23.0"},
      "npm:babel-plugin-transform-es2015-unicode-regex@6.24.1": {
        "babel-helper-regex": "npm:babel-helper-regex@6.24.1",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "regexpu-core": "npm:regexpu-core@2.0.0"
      },
      "npm:babel-plugin-transform-regenerator@6.24.1": {"regenerator-transform": "npm:regenerator-transform@0.9.11"},
      "npm:babel-plugin-transform-strict-mode@6.24.1": {
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-types": "npm:babel-types@6.24.1"
      },
      "npm:babel-polyfill@6.23.0": {
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "core-js": "npm:core-js@2.4.1",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "regenerator-runtime": "npm:regenerator-runtime@0.10.5"
      },
      "npm:babel-preset-es2015@6.24.1": {
        "babel-plugin-check-es2015-constants": "npm:babel-plugin-check-es2015-constants@6.22.0",
        "babel-plugin-transform-es2015-arrow-functions": "npm:babel-plugin-transform-es2015-arrow-functions@6.22.0",
        "babel-plugin-transform-es2015-block-scoped-functions": "npm:babel-plugin-transform-es2015-block-scoped-functions@6.22.0",
        "babel-plugin-transform-es2015-block-scoping": "npm:babel-plugin-transform-es2015-block-scoping@6.24.1",
        "babel-plugin-transform-es2015-classes": "npm:babel-plugin-transform-es2015-classes@6.24.1",
        "babel-plugin-transform-es2015-computed-properties": "npm:babel-plugin-transform-es2015-computed-properties@6.24.1",
        "babel-plugin-transform-es2015-destructuring": "npm:babel-plugin-transform-es2015-destructuring@6.23.0",
        "babel-plugin-transform-es2015-duplicate-keys": "npm:babel-plugin-transform-es2015-duplicate-keys@6.24.1",
        "babel-plugin-transform-es2015-for-of": "npm:babel-plugin-transform-es2015-for-of@6.23.0",
        "babel-plugin-transform-es2015-function-name": "npm:babel-plugin-transform-es2015-function-name@6.24.1",
        "babel-plugin-transform-es2015-literals": "npm:babel-plugin-transform-es2015-literals@6.22.0",
        "babel-plugin-transform-es2015-modules-amd": "npm:babel-plugin-transform-es2015-modules-amd@6.24.1",
        "babel-plugin-transform-es2015-modules-commonjs": "npm:babel-plugin-transform-es2015-modules-commonjs@6.24.1",
        "babel-plugin-transform-es2015-modules-systemjs": "npm:babel-plugin-transform-es2015-modules-systemjs@6.24.1",
        "babel-plugin-transform-es2015-modules-umd": "npm:babel-plugin-transform-es2015-modules-umd@6.24.1",
        "babel-plugin-transform-es2015-object-super": "npm:babel-plugin-transform-es2015-object-super@6.24.1",
        "babel-plugin-transform-es2015-parameters": "npm:babel-plugin-transform-es2015-parameters@6.24.1",
        "babel-plugin-transform-es2015-shorthand-properties": "npm:babel-plugin-transform-es2015-shorthand-properties@6.24.1",
        "babel-plugin-transform-es2015-spread": "npm:babel-plugin-transform-es2015-spread@6.22.0",
        "babel-plugin-transform-es2015-sticky-regex": "npm:babel-plugin-transform-es2015-sticky-regex@6.24.1",
        "babel-plugin-transform-es2015-template-literals": "npm:babel-plugin-transform-es2015-template-literals@6.22.0",
        "babel-plugin-transform-es2015-typeof-symbol": "npm:babel-plugin-transform-es2015-typeof-symbol@6.23.0",
        "babel-plugin-transform-es2015-unicode-regex": "npm:babel-plugin-transform-es2015-unicode-regex@6.24.1",
        "babel-plugin-transform-regenerator": "npm:babel-plugin-transform-regenerator@6.24.1"
      },
      "npm:babel-register@6.24.1": {
        "babel-core": "npm:babel-core@6.24.1",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "core-js": "npm:core-js@2.4.1",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "home-or-tmp": "npm:home-or-tmp@2.0.0",
        "lodash": "npm:lodash@4.17.4",
        "mkdirp": "npm:mkdirp@0.5.1",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "source-map-support": "npm:source-map-support@0.4.15"
      },
      "npm:babel-runtime@5.8.38": {"process": "github:jspm/nodelibs-process@0.1.2"},
      "npm:babel-runtime@6.23.0": {
        "core-js": "npm:core-js@2.4.1",
        "regenerator-runtime": "npm:regenerator-runtime@0.10.5"
      },
      "npm:babel-template@6.24.1": {
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-traverse": "npm:babel-traverse@6.24.1",
        "babel-types": "npm:babel-types@6.24.1",
        "babylon": "npm:babylon@6.17.1",
        "lodash": "npm:lodash@4.17.4"
      },
      "npm:babel-traverse@6.24.1": {
        "babel-code-frame": "npm:babel-code-frame@6.22.0",
        "babel-messages": "npm:babel-messages@6.23.0",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-types": "npm:babel-types@6.24.1",
        "babylon": "npm:babylon@6.17.1",
        "debug": "npm:debug@2.6.7",
        "globals": "npm:globals@9.17.0",
        "invariant": "npm:invariant@2.2.2",
        "lodash": "npm:lodash@4.17.4",
        "process": "github:jspm/nodelibs-process@0.1.2"
      },
      "npm:babel-types@6.24.1": {
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "esutils": "npm:esutils@2.0.2",
        "lodash": "npm:lodash@4.17.4",
        "to-fast-properties": "npm:to-fast-properties@1.0.3"
      },
      "npm:babylon@6.17.1": {
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "process": "github:jspm/nodelibs-process@0.1.2"
      },
      "npm:bcrypt-pbkdf@1.0.1": {"tweetnacl": "npm:tweetnacl@0.14.5"},
      "npm:binary-extensions@1.8.0": {"systemjs-json": "github:systemjs/plugin-json@0.1.2"},
      "npm:block-stream@0.0.9": {
        "assert": "github:jspm/nodelibs-assert@0.1.0",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "inherits": "npm:inherits@2.0.1",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "stream": "github:jspm/nodelibs-stream@0.1.0"
      },
      "npm:bn.js@4.11.6": {"buffer": "github:jspm/nodelibs-buffer@0.1.1"},
      "npm:boom@2.10.1": {
        "hoek": "npm:hoek@2.16.3",
        "http": "github:jspm/nodelibs-http@1.7.1"
      },
      "npm:brace-expansion@1.1.7": {
        "balanced-match": "npm:balanced-match@0.4.2",
        "concat-map": "npm:concat-map@0.0.1"
      },
      "npm:braces@1.8.5": {
        "expand-range": "npm:expand-range@1.8.2",
        "preserve": "npm:preserve@0.2.0",
        "repeat-element": "npm:repeat-element@1.1.2"
      },
      "npm:browserify-aes@1.0.6": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "buffer-xor": "npm:buffer-xor@1.0.3",
        "cipher-base": "npm:cipher-base@1.0.3",
        "create-hash": "npm:create-hash@1.1.3",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "inherits": "npm:inherits@2.0.1",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2"
      },
      "npm:browserify-cipher@1.0.0": {
        "browserify-aes": "npm:browserify-aes@1.0.6",
        "browserify-des": "npm:browserify-des@1.0.0",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0"
      },
      "npm:browserify-des@1.0.0": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "cipher-base": "npm:cipher-base@1.0.3",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "des.js": "npm:des.js@1.0.0",
        "inherits": "npm:inherits@2.0.1"
      },
      "npm:browserify-rsa@4.0.1": {
        "bn.js": "npm:bn.js@4.11.6",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "constants": "github:jspm/nodelibs-constants@0.1.0",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "randombytes": "npm:randombytes@2.0.3"
      },
      "npm:browserify-sign@4.0.4": {
        "bn.js": "npm:bn.js@4.11.6",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "create-hash": "npm:create-hash@1.1.3",
        "create-hmac": "npm:create-hmac@1.1.6",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "elliptic": "npm:elliptic@6.4.0",
        "inherits": "npm:inherits@2.0.1",
        "parse-asn1": "npm:parse-asn1@5.1.0",
        "stream": "github:jspm/nodelibs-stream@0.1.0",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2"
      },
      "npm:browserify-zlib@0.1.4": {
        "assert": "github:jspm/nodelibs-assert@0.1.0",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "pako": "npm:pako@0.2.9",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "readable-stream": "npm:readable-stream@2.2.9",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:buffer-shims@1.0.0": {"buffer": "github:jspm/nodelibs-buffer@0.1.1"},
      "npm:buffer-xor@1.0.3": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2"
      },
      "npm:buffer@5.0.6": {
        "base64-js": "npm:base64-js@1.2.0",
        "ieee754": "npm:ieee754@1.1.8"
      },
      "npm:chalk@1.1.3": {
        "ansi-styles": "npm:ansi-styles@2.2.1",
        "escape-string-regexp": "npm:escape-string-regexp@1.0.5",
        "has-ansi": "npm:has-ansi@2.0.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "strip-ansi": "npm:strip-ansi@3.0.1",
        "supports-color": "npm:supports-color@2.0.0"
      },
      "npm:chokidar@1.7.0": {
        "anymatch": "npm:anymatch@1.3.0",
        "async-each": "npm:async-each@1.0.1",
        "events": "github:jspm/nodelibs-events@0.1.1",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "fsevents": "npm:fsevents@1.1.1",
        "glob-parent": "npm:glob-parent@2.0.0",
        "inherits": "npm:inherits@2.0.1",
        "is-binary-path": "npm:is-binary-path@1.0.1",
        "is-glob": "npm:is-glob@2.0.1",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "path-is-absolute": "npm:path-is-absolute@1.0.1",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "readdirp": "npm:readdirp@2.1.0"
      },
      "npm:cipher-base@1.0.3": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "inherits": "npm:inherits@2.0.1",
        "stream": "github:jspm/nodelibs-stream@0.1.0",
        "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0"
      },
      "npm:combined-stream@1.0.5": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "delayed-stream": "npm:delayed-stream@1.0.0",
        "stream": "github:jspm/nodelibs-stream@0.1.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:commander@2.9.0": {
        "child_process": "github:jspm/nodelibs-child_process@0.1.0",
        "events": "github:jspm/nodelibs-events@0.1.1",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "graceful-readlink": "npm:graceful-readlink@1.0.1",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2"
      },
      "npm:constants-browserify@0.0.1": {"systemjs-json": "github:systemjs/plugin-json@0.1.2"},
      "npm:convert-source-map@1.5.0": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "path": "github:jspm/nodelibs-path@0.1.0"
      },
      "npm:core-js@1.2.7": {
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2"
      },
      "npm:core-js@2.4.1": {
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2"
      },
      "npm:core-util-is@1.0.2": {"buffer": "github:jspm/nodelibs-buffer@0.1.1"},
      "npm:create-ecdh@4.0.0": {
        "bn.js": "npm:bn.js@4.11.6",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "elliptic": "npm:elliptic@6.4.0"
      },
      "npm:create-hash@1.1.3": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "cipher-base": "npm:cipher-base@1.0.3",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "inherits": "npm:inherits@2.0.1",
        "ripemd160": "npm:ripemd160@2.0.1",
        "sha.js": "npm:sha.js@2.4.8"
      },
      "npm:create-hmac@1.1.6": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "cipher-base": "npm:cipher-base@1.0.3",
        "create-hash": "npm:create-hash@1.1.3",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "inherits": "npm:inherits@2.0.1",
        "ripemd160": "npm:ripemd160@2.0.1",
        "safe-buffer": "npm:safe-buffer@5.0.1",
        "sha.js": "npm:sha.js@2.4.8"
      },
      "npm:cryptiles@2.0.5": {
        "boom": "npm:boom@2.10.1",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0"
      },
      "npm:crypto-browserify@3.11.0": {
        "browserify-cipher": "npm:browserify-cipher@1.0.0",
        "browserify-sign": "npm:browserify-sign@4.0.4",
        "create-ecdh": "npm:create-ecdh@4.0.0",
        "create-hash": "npm:create-hash@1.1.3",
        "create-hmac": "npm:create-hmac@1.1.6",
        "diffie-hellman": "npm:diffie-hellman@5.0.2",
        "inherits": "npm:inherits@2.0.1",
        "pbkdf2": "npm:pbkdf2@3.0.12",
        "public-encrypt": "npm:public-encrypt@4.0.0",
        "randombytes": "npm:randombytes@2.0.3"
      },
      "npm:dashdash@1.14.1": {
        "assert-plus": "npm:assert-plus@1.0.0",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:debug@2.6.7": {"ms": "npm:ms@2.0.0"},
      "npm:deep-extend@0.4.2": {"buffer": "github:jspm/nodelibs-buffer@0.1.1"},
      "npm:delayed-stream@1.0.0": {
        "stream": "github:jspm/nodelibs-stream@0.1.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:des.js@1.0.0": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "inherits": "npm:inherits@2.0.1",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      },
      "npm:detect-indent@4.0.0": {"repeating": "npm:repeating@2.0.1"},
      "npm:diffie-hellman@5.0.2": {
        "bn.js": "npm:bn.js@4.11.6",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "miller-rabin": "npm:miller-rabin@4.0.0",
        "randombytes": "npm:randombytes@2.0.3",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2"
      },
      "npm:ecc-jsbn@0.1.1": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "jsbn": "npm:jsbn@0.1.1"
      },
      "npm:elliptic@6.4.0": {
        "bn.js": "npm:bn.js@4.11.6",
        "brorand": "npm:brorand@1.1.0",
        "hash.js": "npm:hash.js@1.0.3",
        "hmac-drbg": "npm:hmac-drbg@1.0.1",
        "inherits": "npm:inherits@2.0.1",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
        "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2"
      },
      "npm:evp_bytestokey@1.0.0": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "create-hash": "npm:create-hash@1.1.3",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0"
      },
      "npm:expand-brackets@0.1.5": {"is-posix-bracket": "npm:is-posix-bracket@0.1.1"},
      "npm:expand-range@1.8.2": {"fill-range": "npm:fill-range@2.2.3"},
      "npm:extglob@0.3.2": {"is-extglob": "npm:is-extglob@1.0.0"},
      "npm:extsprintf@1.0.2": {
        "assert": "github:jspm/nodelibs-assert@0.1.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:fill-range@2.2.3": {
        "is-number": "npm:is-number@2.1.0",
        "isobject": "npm:isobject@2.1.0",
        "randomatic": "npm:randomatic@1.1.6",
        "repeat-element": "npm:repeat-element@1.1.2",
        "repeat-string": "npm:repeat-string@1.6.1"
      },
      "npm:for-own@0.1.5": {"for-in": "npm:for-in@1.0.2"},
      "npm:forever-agent@0.6.1": {
        "http": "github:jspm/nodelibs-http@1.7.1",
        "https": "github:jspm/nodelibs-https@0.1.0",
        "net": "github:jspm/nodelibs-net@0.1.2",
        "tls": "github:jspm/nodelibs-tls@0.1.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:form-data@2.1.4": {
        "asynckit": "npm:asynckit@0.4.0",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "combined-stream": "npm:combined-stream@1.0.5",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "http": "github:jspm/nodelibs-http@1.7.1",
        "https": "github:jspm/nodelibs-https@0.1.0",
        "mime-types": "npm:mime-types@2.1.15",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "url": "github:jspm/nodelibs-url@0.1.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:fs-readdir-recursive@1.0.0": {
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "path": "github:jspm/nodelibs-path@0.1.0"
      },
      "npm:fs.realpath@1.0.0": {
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2"
      },
      "npm:fsevents@1.1.1": {
        "child_process": "github:jspm/nodelibs-child_process@0.1.0",
        "events": "github:jspm/nodelibs-events@0.1.1",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "nan": "npm:nan@2.6.2",
        "node-pre-gyp": "npm:node-pre-gyp@0.6.34",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:fstream-ignore@1.0.5": {
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "fstream": "npm:fstream@1.0.11",
        "inherits": "npm:inherits@2.0.1",
        "minimatch": "npm:minimatch@3.0.4",
        "path": "github:jspm/nodelibs-path@0.1.0"
      },
      "npm:fstream@1.0.11": {
        "assert": "github:jspm/nodelibs-assert@0.1.0",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "graceful-fs": "npm:graceful-fs@4.1.11",
        "inherits": "npm:inherits@2.0.1",
        "mkdirp": "npm:mkdirp@0.5.1",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "rimraf": "npm:rimraf@2.6.1",
        "stream": "github:jspm/nodelibs-stream@0.1.0"
      },
      "npm:gauge@2.7.4": {
        "aproba": "npm:aproba@1.1.1",
        "console-control-strings": "npm:console-control-strings@1.1.0",
        "has-unicode": "npm:has-unicode@2.0.1",
        "object-assign": "npm:object-assign@4.1.1",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "signal-exit": "npm:signal-exit@3.0.2",
        "string-width": "npm:string-width@1.0.2",
        "strip-ansi": "npm:strip-ansi@3.0.1",
        "util": "github:jspm/nodelibs-util@0.1.0",
        "wide-align": "npm:wide-align@1.1.2"
      },
      "npm:getpass@0.1.7": {
        "assert-plus": "npm:assert-plus@1.0.0",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "tty": "github:jspm/nodelibs-tty@0.1.0"
      },
      "npm:glob-base@0.3.0": {
        "glob-parent": "npm:glob-parent@2.0.0",
        "is-glob": "npm:is-glob@2.0.1",
        "path": "github:jspm/nodelibs-path@0.1.0"
      },
      "npm:glob-parent@2.0.0": {
        "assert": "github:jspm/nodelibs-assert@0.1.0",
        "is-glob": "npm:is-glob@2.0.1",
        "path": "github:jspm/nodelibs-path@0.1.0"
      },
      "npm:glob@7.1.1": {
        "assert": "github:jspm/nodelibs-assert@0.1.0",
        "events": "github:jspm/nodelibs-events@0.1.1",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "fs.realpath": "npm:fs.realpath@1.0.0",
        "inflight": "npm:inflight@1.0.6",
        "inherits": "npm:inherits@2.0.1",
        "minimatch": "npm:minimatch@3.0.4",
        "once": "npm:once@1.4.0",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "path-is-absolute": "npm:path-is-absolute@1.0.1",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:globals@9.17.0": {"systemjs-json": "github:systemjs/plugin-json@0.1.2"},
      "npm:graceful-fs@4.1.11": {
        "assert": "github:jspm/nodelibs-assert@0.1.0",
        "constants": "github:jspm/nodelibs-constants@0.1.0",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "stream": "github:jspm/nodelibs-stream@0.1.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:graceful-readlink@1.0.1": {"fs": "github:jspm/nodelibs-fs@0.1.2"},
      "npm:har-schema@1.0.5": {"systemjs-json": "github:systemjs/plugin-json@0.1.2"},
      "npm:har-validator@4.2.1": {
        "ajv": "npm:ajv@4.11.8",
        "har-schema": "npm:har-schema@1.0.5"
      },
      "npm:has-ansi@2.0.0": {"ansi-regex": "npm:ansi-regex@2.1.1"},
      "npm:has-unicode@2.0.1": {
        "os": "github:jspm/nodelibs-os@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2"
      },
      "npm:hash-base@2.0.2": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "inherits": "npm:inherits@2.0.1",
        "stream": "github:jspm/nodelibs-stream@0.1.0"
      },
      "npm:hash.js@1.0.3": {"inherits": "npm:inherits@2.0.1"},
      "npm:hawk@3.1.3": {
        "boom": "npm:boom@2.10.1",
        "cryptiles": "npm:cryptiles@2.0.5",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "hoek": "npm:hoek@2.16.3",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "sntp": "npm:sntp@1.0.9",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2",
        "url": "github:jspm/nodelibs-url@0.1.0"
      },
      "npm:hmac-drbg@1.0.1": {
        "hash.js": "npm:hash.js@1.0.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
        "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2"
      },
      "npm:hoek@2.16.3": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:home-or-tmp@2.0.0": {
        "os-homedir": "npm:os-homedir@1.0.2",
        "os-tmpdir": "npm:os-tmpdir@1.0.2"
      },
      "npm:http-signature@1.1.1": {
        "assert-plus": "npm:assert-plus@0.2.0",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "http": "github:jspm/nodelibs-http@1.7.1",
        "jsprim": "npm:jsprim@1.4.0",
        "sshpk": "npm:sshpk@1.13.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:https-browserify@0.0.0": {"http": "github:jspm/nodelibs-http@1.7.1"},
      "npm:inflight@1.0.6": {
        "once": "npm:once@1.4.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "wrappy": "npm:wrappy@1.0.2"
      },
      "npm:inherits@2.0.1": {"util": "github:jspm/nodelibs-util@0.1.0"},
      "npm:ini@1.3.4": {"process": "github:jspm/nodelibs-process@0.1.2"},
      "npm:invariant@2.2.2": {
        "loose-envify": "npm:loose-envify@1.3.1",
        "process": "github:jspm/nodelibs-process@0.1.2"
      },
      "npm:is-binary-path@1.0.1": {
        "binary-extensions": "npm:binary-extensions@1.8.0",
        "path": "github:jspm/nodelibs-path@0.1.0"
      },
      "npm:is-buffer@1.1.5": {"buffer": "github:jspm/nodelibs-buffer@0.1.1"},
      "npm:is-equal-shallow@0.1.3": {"is-primitive": "npm:is-primitive@2.0.0"},
      "npm:is-finite@1.0.2": {"number-is-nan": "npm:number-is-nan@1.0.1"},
      "npm:is-fullwidth-code-point@1.0.0": {"number-is-nan": "npm:number-is-nan@1.0.1"},
      "npm:is-glob@2.0.1": {"is-extglob": "npm:is-extglob@1.0.0"},
      "npm:is-number@2.1.0": {"kind-of": "npm:kind-of@3.2.2"},
      "npm:isobject@2.1.0": {"isarray": "npm:isarray@1.0.0"},
      "npm:isstream@0.1.2": {
        "events": "github:jspm/nodelibs-events@0.1.1",
        "stream": "github:jspm/nodelibs-stream@0.1.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:jodid25519@1.0.2": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "jsbn": "npm:jsbn@0.1.1"
      },
      "npm:json-stable-stringify@1.0.1": {"jsonify": "npm:jsonify@0.0.0"},
      "npm:json5@0.5.1": {
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2"
      },
      "npm:jsprim@1.4.0": {
        "assert-plus": "npm:assert-plus@1.0.0",
        "extsprintf": "npm:extsprintf@1.0.2",
        "json-schema": "npm:json-schema@0.2.3",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "util": "github:jspm/nodelibs-util@0.1.0",
        "verror": "npm:verror@1.3.6"
      },
      "npm:kind-of@3.2.2": {"is-buffer": "npm:is-buffer@1.1.5"},
      "npm:loose-envify@1.3.1": {
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "js-tokens": "npm:js-tokens@3.0.1",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "stream": "github:jspm/nodelibs-stream@0.1.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:micromatch@2.3.11": {
        "arr-diff": "npm:arr-diff@2.0.0",
        "array-unique": "npm:array-unique@0.2.1",
        "braces": "npm:braces@1.8.5",
        "expand-brackets": "npm:expand-brackets@0.1.5",
        "extglob": "npm:extglob@0.3.2",
        "filename-regex": "npm:filename-regex@2.0.1",
        "is-extglob": "npm:is-extglob@1.0.0",
        "is-glob": "npm:is-glob@2.0.1",
        "kind-of": "npm:kind-of@3.2.2",
        "normalize-path": "npm:normalize-path@2.1.1",
        "object.omit": "npm:object.omit@2.0.1",
        "parse-glob": "npm:parse-glob@3.0.4",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "regex-cache": "npm:regex-cache@0.4.3"
      },
      "npm:miller-rabin@4.0.0": {
        "bn.js": "npm:bn.js@4.11.6",
        "brorand": "npm:brorand@1.1.0"
      },
      "npm:mime-db@1.27.0": {"systemjs-json": "github:systemjs/plugin-json@0.1.2"},
      "npm:mime-types@2.1.15": {
        "mime-db": "npm:mime-db@1.27.0",
        "path": "github:jspm/nodelibs-path@0.1.0"
      },
      "npm:minimatch@3.0.4": {
        "brace-expansion": "npm:brace-expansion@1.1.7",
        "path": "github:jspm/nodelibs-path@0.1.0"
      },
      "npm:mkdirp@0.5.1": {
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "minimist": "npm:minimist@0.0.8",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2"
      },
      "npm:nan@2.6.2": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2"
      },
      "npm:node-pre-gyp@0.6.34": {
        "child_process": "github:jspm/nodelibs-child_process@0.1.0",
        "events": "github:jspm/nodelibs-events@0.1.1",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "mkdirp": "npm:mkdirp@0.5.1",
        "nopt": "npm:nopt@4.0.1",
        "npmlog": "npm:npmlog@4.1.0",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "rc": "npm:rc@1.2.1",
        "request": "npm:request@2.81.0",
        "rimraf": "npm:rimraf@2.6.1",
        "semver": "npm:semver@5.3.0",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2",
        "tar": "npm:tar@2.2.1",
        "tar-pack": "npm:tar-pack@3.4.0",
        "url": "github:jspm/nodelibs-url@0.1.0",
        "util": "github:jspm/nodelibs-util@0.1.0",
        "zlib": "github:jspm/nodelibs-zlib@0.1.0"
      },
      "npm:nopt@4.0.1": {
        "abbrev": "npm:abbrev@1.1.0",
        "osenv": "npm:osenv@0.1.4",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "stream": "github:jspm/nodelibs-stream@0.1.0",
        "url": "github:jspm/nodelibs-url@0.1.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:normalize-path@2.1.1": {"remove-trailing-separator": "npm:remove-trailing-separator@1.0.1"},
      "npm:npmlog@4.1.0": {
        "are-we-there-yet": "npm:are-we-there-yet@1.1.4",
        "console-control-strings": "npm:console-control-strings@1.1.0",
        "events": "github:jspm/nodelibs-events@0.1.1",
        "gauge": "npm:gauge@2.7.4",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "set-blocking": "npm:set-blocking@2.0.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:oauth-sign@0.8.2": {
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "querystring": "github:jspm/nodelibs-querystring@0.1.0"
      },
      "npm:object.omit@2.0.1": {
        "for-own": "npm:for-own@0.1.5",
        "is-extendable": "npm:is-extendable@0.1.1"
      },
      "npm:once@1.4.0": {"wrappy": "npm:wrappy@1.0.2"},
      "npm:os-browserify@0.1.2": {"os": "github:jspm/nodelibs-os@0.1.0"},
      "npm:os-homedir@1.0.2": {
        "os": "github:jspm/nodelibs-os@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2"
      },
      "npm:os-tmpdir@1.0.2": {"process": "github:jspm/nodelibs-process@0.1.2"},
      "npm:osenv@0.1.4": {
        "child_process": "github:jspm/nodelibs-child_process@0.1.0",
        "os-homedir": "npm:os-homedir@1.0.2",
        "os-tmpdir": "npm:os-tmpdir@1.0.2",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2"
      },
      "npm:output-file-sync@1.1.2": {
        "graceful-fs": "npm:graceful-fs@4.1.11",
        "mkdirp": "npm:mkdirp@0.5.1",
        "object-assign": "npm:object-assign@4.1.1",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:pako@0.2.9": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "process": "github:jspm/nodelibs-process@0.1.2"
      },
      "npm:parse-asn1@5.1.0": {
        "asn1.js": "npm:asn1.js@4.9.1",
        "browserify-aes": "npm:browserify-aes@1.0.6",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "create-hash": "npm:create-hash@1.1.3",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "pbkdf2": "npm:pbkdf2@3.0.12",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2"
      },
      "npm:parse-glob@3.0.4": {
        "glob-base": "npm:glob-base@0.3.0",
        "is-dotfile": "npm:is-dotfile@1.0.2",
        "is-extglob": "npm:is-extglob@1.0.0",
        "is-glob": "npm:is-glob@2.0.1"
      },
      "npm:path-browserify@0.0.0": {"process": "github:jspm/nodelibs-process@0.1.2"},
      "npm:path-is-absolute@1.0.1": {"process": "github:jspm/nodelibs-process@0.1.2"},
      "npm:pbkdf2@3.0.12": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "create-hash": "npm:create-hash@1.1.3",
        "create-hmac": "npm:create-hmac@1.1.6",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "ripemd160": "npm:ripemd160@2.0.1",
        "safe-buffer": "npm:safe-buffer@5.0.1",
        "sha.js": "npm:sha.js@2.4.8"
      },
      "npm:performance-now@0.2.0": {"process": "github:jspm/nodelibs-process@0.1.2"},
      "npm:process-nextick-args@1.0.7": {"process": "github:jspm/nodelibs-process@0.1.2"},
      "npm:process@0.11.10": {
        "assert": "github:jspm/nodelibs-assert@0.1.0",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "vm": "github:jspm/nodelibs-vm@0.1.0"
      },
      "npm:public-encrypt@4.0.0": {
        "bn.js": "npm:bn.js@4.11.6",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "create-hash": "npm:create-hash@1.1.3",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "parse-asn1": "npm:parse-asn1@5.1.0",
        "randombytes": "npm:randombytes@2.0.3"
      },
      "npm:punycode@1.3.2": {"process": "github:jspm/nodelibs-process@0.1.2"},
      "npm:punycode@1.4.1": {"process": "github:jspm/nodelibs-process@0.1.2"},
      "npm:randomatic@1.1.6": {
        "is-number": "npm:is-number@2.1.0",
        "kind-of": "npm:kind-of@3.2.2"
      },
      "npm:randombytes@2.0.3": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2"
      },
      "npm:rc@1.2.1": {
        "deep-extend": "npm:deep-extend@0.4.2",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "ini": "npm:ini@1.3.4",
        "minimist": "npm:minimist@1.2.0",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "strip-json-comments": "npm:strip-json-comments@2.0.1"
      },
      "npm:readable-stream@1.1.14": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "core-util-is": "npm:core-util-is@1.0.2",
        "events": "github:jspm/nodelibs-events@0.1.1",
        "inherits": "npm:inherits@2.0.1",
        "isarray": "npm:isarray@0.0.1",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "stream-browserify": "npm:stream-browserify@1.0.0",
        "string_decoder": "npm:string_decoder@0.10.31"
      },
      "npm:readable-stream@2.2.9": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "buffer-shims": "npm:buffer-shims@1.0.0",
        "core-util-is": "npm:core-util-is@1.0.2",
        "events": "github:jspm/nodelibs-events@0.1.1",
        "inherits": "npm:inherits@2.0.1",
        "isarray": "npm:isarray@1.0.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "process-nextick-args": "npm:process-nextick-args@1.0.7",
        "stream": "github:jspm/nodelibs-stream@0.1.0",
        "string_decoder": "npm:string_decoder@1.0.0",
        "util-deprecate": "npm:util-deprecate@1.0.2"
      },
      "npm:readdirp@2.1.0": {
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "graceful-fs": "npm:graceful-fs@4.1.11",
        "minimatch": "npm:minimatch@3.0.4",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "readable-stream": "npm:readable-stream@2.2.9",
        "set-immediate-shim": "npm:set-immediate-shim@1.0.1",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:regenerator-runtime@0.10.5": {"path": "github:jspm/nodelibs-path@0.1.0"},
      "npm:regenerator-transform@0.9.11": {
        "assert": "github:jspm/nodelibs-assert@0.1.0",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-types": "npm:babel-types@6.24.1",
        "private": "npm:private@0.1.7",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:regex-cache@0.4.3": {
        "is-equal-shallow": "npm:is-equal-shallow@0.1.3",
        "is-primitive": "npm:is-primitive@2.0.0"
      },
      "npm:regexpu-core@2.0.0": {
        "process": "github:jspm/nodelibs-process@0.1.2",
        "regenerate": "npm:regenerate@1.3.2",
        "regjsgen": "npm:regjsgen@0.2.0",
        "regjsparser": "npm:regjsparser@0.1.5",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2"
      },
      "npm:regjsparser@0.1.5": {"jsesc": "npm:jsesc@0.5.0"},
      "npm:remove-trailing-separator@1.0.1": {"process": "github:jspm/nodelibs-process@0.1.2"},
      "npm:repeating@2.0.1": {"is-finite": "npm:is-finite@1.0.2"},
      "npm:request@2.81.0": {
        "aws-sign2": "npm:aws-sign2@0.6.0",
        "aws4": "npm:aws4@1.6.0",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "caseless": "npm:caseless@0.12.0",
        "combined-stream": "npm:combined-stream@1.0.5",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "extend": "npm:extend@3.0.1",
        "forever-agent": "npm:forever-agent@0.6.1",
        "form-data": "npm:form-data@2.1.4",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "har-validator": "npm:har-validator@4.2.1",
        "hawk": "npm:hawk@3.1.3",
        "http": "github:jspm/nodelibs-http@1.7.1",
        "http-signature": "npm:http-signature@1.1.1",
        "https": "github:jspm/nodelibs-https@0.1.0",
        "is-typedarray": "npm:is-typedarray@1.0.0",
        "isstream": "npm:isstream@0.1.2",
        "json-stringify-safe": "npm:json-stringify-safe@5.0.1",
        "mime-types": "npm:mime-types@2.1.15",
        "oauth-sign": "npm:oauth-sign@0.8.2",
        "performance-now": "npm:performance-now@0.2.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "qs": "npm:qs@6.4.0",
        "querystring": "github:jspm/nodelibs-querystring@0.1.0",
        "safe-buffer": "npm:safe-buffer@5.0.1",
        "stream": "github:jspm/nodelibs-stream@0.1.0",
        "stringstream": "npm:stringstream@0.0.5",
        "tough-cookie": "npm:tough-cookie@2.3.2",
        "tunnel-agent": "npm:tunnel-agent@0.6.0",
        "url": "github:jspm/nodelibs-url@0.1.0",
        "util": "github:jspm/nodelibs-util@0.1.0",
        "uuid": "npm:uuid@3.0.1",
        "zlib": "github:jspm/nodelibs-zlib@0.1.0"
      },
      "npm:rimraf@2.6.1": {
        "assert": "github:jspm/nodelibs-assert@0.1.0",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "glob": "npm:glob@7.1.1",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2"
      },
      "npm:ripemd160@2.0.1": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "hash-base": "npm:hash-base@2.0.2",
        "inherits": "npm:inherits@2.0.1"
      },
      "npm:safe-buffer@5.0.1": {"buffer": "github:jspm/nodelibs-buffer@0.1.1"},
      "npm:semver@5.3.0": {"process": "github:jspm/nodelibs-process@0.1.2"},
      "npm:set-blocking@2.0.0": {"process": "github:jspm/nodelibs-process@0.1.2"},
      "npm:sha.js@2.4.8": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "inherits": "npm:inherits@2.0.1",
        "process": "github:jspm/nodelibs-process@0.1.2"
      },
      "npm:signal-exit@3.0.2": {
        "assert": "github:jspm/nodelibs-assert@0.1.0",
        "events": "github:jspm/nodelibs-events@0.1.1",
        "process": "github:jspm/nodelibs-process@0.1.2"
      },
      "npm:sntp@1.0.9": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "dgram": "github:jspm/nodelibs-dgram@0.1.0",
        "dns": "github:jspm/nodelibs-dns@0.1.0",
        "hoek": "npm:hoek@2.16.3",
        "process": "github:jspm/nodelibs-process@0.1.2"
      },
      "npm:source-map-support@0.4.15": {
        "assert": "github:jspm/nodelibs-assert@0.1.0",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "child_process": "github:jspm/nodelibs-child_process@0.1.0",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "module": "github:jspm/nodelibs-module@0.1.0",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "querystring": "github:jspm/nodelibs-querystring@0.1.0",
        "source-map": "npm:source-map@0.5.6"
      },
      "npm:source-map@0.5.6": {"process": "github:jspm/nodelibs-process@0.1.2"},
      "npm:sshpk@1.13.0": {
        "asn1": "npm:asn1@0.2.3",
        "assert-plus": "npm:assert-plus@1.0.0",
        "bcrypt-pbkdf": "npm:bcrypt-pbkdf@1.0.1",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "dashdash": "npm:dashdash@1.14.1",
        "ecc-jsbn": "npm:ecc-jsbn@0.1.1",
        "getpass": "npm:getpass@0.1.7",
        "jodid25519": "npm:jodid25519@1.0.2",
        "jsbn": "npm:jsbn@0.1.1",
        "stream": "github:jspm/nodelibs-stream@0.1.0",
        "tweetnacl": "npm:tweetnacl@0.14.5",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:stream-browserify@1.0.0": {
        "events": "github:jspm/nodelibs-events@0.1.1",
        "inherits": "npm:inherits@2.0.1",
        "readable-stream": "npm:readable-stream@1.1.14"
      },
      "npm:string-width@1.0.2": {
        "code-point-at": "npm:code-point-at@1.1.0",
        "is-fullwidth-code-point": "npm:is-fullwidth-code-point@1.0.0",
        "strip-ansi": "npm:strip-ansi@3.0.1"
      },
      "npm:string_decoder@0.10.31": {"buffer": "github:jspm/nodelibs-buffer@0.1.1"},
      "npm:string_decoder@1.0.0": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "buffer-shims": "npm:buffer-shims@1.0.0"
      },
      "npm:stringstream@0.0.5": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "stream": "github:jspm/nodelibs-stream@0.1.0",
        "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0",
        "util": "github:jspm/nodelibs-util@0.1.0",
        "zlib": "github:jspm/nodelibs-zlib@0.1.0"
      },
      "npm:strip-ansi@3.0.1": {"ansi-regex": "npm:ansi-regex@2.1.1"},
      "npm:supports-color@2.0.0": {"process": "github:jspm/nodelibs-process@0.1.2"},
      "npm:tar-pack@3.4.0": {
        "debug": "npm:debug@2.6.7",
        "fstream": "npm:fstream@1.0.11",
        "fstream-ignore": "npm:fstream-ignore@1.0.5",
        "once": "npm:once@1.4.0",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "readable-stream": "npm:readable-stream@2.2.9",
        "rimraf": "npm:rimraf@2.6.1",
        "stream": "github:jspm/nodelibs-stream@0.1.0",
        "tar": "npm:tar@2.2.1",
        "uid-number": "npm:uid-number@0.0.6",
        "zlib": "github:jspm/nodelibs-zlib@0.1.0"
      },
      "npm:tar@2.2.1": {
        "assert": "github:jspm/nodelibs-assert@0.1.0",
        "block-stream": "npm:block-stream@0.0.9",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "fstream": "npm:fstream@1.0.11",
        "inherits": "npm:inherits@2.0.1",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "stream": "github:jspm/nodelibs-stream@0.1.0",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2"
      },
      "npm:timers-browserify@1.4.2": {"process": "npm:process@0.11.10"},
      "npm:tough-cookie@2.3.2": {
        "net": "github:jspm/nodelibs-net@0.1.2",
        "punycode": "npm:punycode@1.4.1",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2",
        "url": "github:jspm/nodelibs-url@0.1.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:tunnel-agent@0.6.0": {
        "assert": "github:jspm/nodelibs-assert@0.1.0",
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "events": "github:jspm/nodelibs-events@0.1.1",
        "http": "github:jspm/nodelibs-http@1.7.1",
        "https": "github:jspm/nodelibs-https@0.1.0",
        "net": "github:jspm/nodelibs-net@0.1.2",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "safe-buffer": "npm:safe-buffer@5.0.1",
        "tls": "github:jspm/nodelibs-tls@0.1.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:uid-number@0.0.6": {
        "child_process": "github:jspm/nodelibs-child_process@0.1.0",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2"
      },
      "npm:url@0.10.3": {
        "assert": "github:jspm/nodelibs-assert@0.1.0",
        "punycode": "npm:punycode@1.3.2",
        "querystring": "npm:querystring@0.2.0",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:user-home@1.1.1": {
        "process": "github:jspm/nodelibs-process@0.1.2",
        "systemjs-json": "github:systemjs/plugin-json@0.1.2"
      },
      "npm:util-deprecate@1.0.2": {"util": "github:jspm/nodelibs-util@0.1.0"},
      "npm:util@0.10.3": {
        "inherits": "npm:inherits@2.0.1",
        "process": "github:jspm/nodelibs-process@0.1.2"
      },
      "npm:uuid@3.0.1": {"crypto": "github:jspm/nodelibs-crypto@0.1.0"},
      "npm:v8flags@2.1.1": {
        "buffer": "github:jspm/nodelibs-buffer@0.1.1",
        "child_process": "github:jspm/nodelibs-child_process@0.1.0",
        "crypto": "github:jspm/nodelibs-crypto@0.1.0",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "os": "github:jspm/nodelibs-os@0.1.0",
        "path": "github:jspm/nodelibs-path@0.1.0",
        "process": "github:jspm/nodelibs-process@0.1.2",
        "user-home": "npm:user-home@1.1.1"
      },
      "npm:verror@1.3.6": {
        "assert": "github:jspm/nodelibs-assert@0.1.0",
        "extsprintf": "npm:extsprintf@1.0.2",
        "fs": "github:jspm/nodelibs-fs@0.1.2",
        "util": "github:jspm/nodelibs-util@0.1.0"
      },
      "npm:vm-browserify@0.0.4": {"indexof": "npm:indexof@0.0.1"},
      "npm:wide-align@1.1.2": {"string-width": "npm:string-width@1.0.2"}
    }
  });
})(require('process'));
