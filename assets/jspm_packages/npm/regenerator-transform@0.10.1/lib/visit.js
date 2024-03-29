/* */ 
(function(process) {
  "use strict";
  var _assert = require('assert');
  var _assert2 = _interopRequireDefault(_assert);
  var _babelTypes = require('babel-types');
  var t = _interopRequireWildcard(_babelTypes);
  var _hoist = require('./hoist');
  var _emit = require('./emit');
  var _replaceShorthandObjectMethod = require('./replaceShorthandObjectMethod');
  var _replaceShorthandObjectMethod2 = _interopRequireDefault(_replaceShorthandObjectMethod);
  var _util = require('./util');
  var util = _interopRequireWildcard(_util);
  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};
      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key))
            newObj[key] = obj[key];
        }
      }
      newObj.default = obj;
      return newObj;
    }
  }
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  exports.visitor = {Function: {exit: function exit(path, state) {
        var node = path.node;
        if (node.generator) {
          if (node.async) {
            if (state.opts.asyncGenerators === false)
              return;
          } else {
            if (state.opts.generators === false)
              return;
          }
        } else if (node.async) {
          if (state.opts.async === false)
            return;
        } else {
          return;
        }
        path = (0, _replaceShorthandObjectMethod2.default)(path);
        node = path.node;
        var contextId = path.scope.generateUidIdentifier("context");
        var argsId = path.scope.generateUidIdentifier("args");
        path.ensureBlock();
        var bodyBlockPath = path.get("body");
        if (node.async) {
          bodyBlockPath.traverse(awaitVisitor);
        }
        bodyBlockPath.traverse(functionSentVisitor, {context: contextId});
        var outerBody = [];
        var innerBody = [];
        bodyBlockPath.get("body").forEach(function(childPath) {
          var node = childPath.node;
          if (t.isExpressionStatement(node) && t.isStringLiteral(node.expression)) {
            outerBody.push(node);
          } else if (node && node._blockHoist != null) {
            outerBody.push(node);
          } else {
            innerBody.push(node);
          }
        });
        if (outerBody.length > 0) {
          bodyBlockPath.node.body = innerBody;
        }
        var outerFnExpr = getOuterFnExpr(path);
        t.assertIdentifier(node.id);
        var innerFnId = t.identifier(node.id.name + "$");
        var vars = (0, _hoist.hoist)(path);
        var didRenameArguments = renameArguments(path, argsId);
        if (didRenameArguments) {
          vars = vars || t.variableDeclaration("var", []);
          var argumentIdentifier = t.identifier("arguments");
          argumentIdentifier._shadowedFunctionLiteral = path;
          vars.declarations.push(t.variableDeclarator(argsId, argumentIdentifier));
        }
        var emitter = new _emit.Emitter(contextId);
        emitter.explode(path.get("body"));
        if (vars && vars.declarations.length > 0) {
          outerBody.push(vars);
        }
        var wrapArgs = [emitter.getContextFunction(innerFnId), node.generator ? outerFnExpr : t.nullLiteral(), t.thisExpression()];
        var tryLocsList = emitter.getTryLocsList();
        if (tryLocsList) {
          wrapArgs.push(tryLocsList);
        }
        var wrapCall = t.callExpression(util.runtimeProperty(node.async ? "async" : "wrap"), wrapArgs);
        outerBody.push(t.returnStatement(wrapCall));
        node.body = t.blockStatement(outerBody);
        var oldDirectives = bodyBlockPath.node.directives;
        if (oldDirectives) {
          node.body.directives = oldDirectives;
        }
        var wasGeneratorFunction = node.generator;
        if (wasGeneratorFunction) {
          node.generator = false;
        }
        if (node.async) {
          node.async = false;
        }
        if (wasGeneratorFunction && t.isExpression(node)) {
          util.replaceWithOrRemove(path, t.callExpression(util.runtimeProperty("mark"), [node]));
          path.addComment("leading", "#__PURE__");
        }
        path.requeue();
      }}};
  function getOuterFnExpr(funPath) {
    var node = funPath.node;
    t.assertFunction(node);
    if (!node.id) {
      node.id = funPath.scope.parent.generateUidIdentifier("callee");
    }
    if (node.generator && t.isFunctionDeclaration(node)) {
      return getMarkedFunctionId(funPath);
    }
    return node.id;
  }
  var getMarkInfo = require('private').makeAccessor();
  function getMarkedFunctionId(funPath) {
    var node = funPath.node;
    t.assertIdentifier(node.id);
    var blockPath = funPath.findParent(function(path) {
      return path.isProgram() || path.isBlockStatement();
    });
    if (!blockPath) {
      return node.id;
    }
    var block = blockPath.node;
    _assert2.default.ok(Array.isArray(block.body));
    var info = getMarkInfo(block);
    if (!info.decl) {
      info.decl = t.variableDeclaration("var", []);
      blockPath.unshiftContainer("body", info.decl);
      info.declPath = blockPath.get("body.0");
    }
    _assert2.default.strictEqual(info.declPath.node, info.decl);
    var markedId = blockPath.scope.generateUidIdentifier("marked");
    var markCallExp = t.callExpression(util.runtimeProperty("mark"), [node.id]);
    var index = info.decl.declarations.push(t.variableDeclarator(markedId, markCallExp)) - 1;
    var markCallExpPath = info.declPath.get("declarations." + index + ".init");
    _assert2.default.strictEqual(markCallExpPath.node, markCallExp);
    markCallExpPath.addComment("leading", "#__PURE__");
    return markedId;
  }
  function renameArguments(funcPath, argsId) {
    var state = {
      didRenameArguments: false,
      argsId: argsId
    };
    funcPath.traverse(argumentsVisitor, state);
    return state.didRenameArguments;
  }
  var argumentsVisitor = {
    "FunctionExpression|FunctionDeclaration": function FunctionExpressionFunctionDeclaration(path) {
      path.skip();
    },
    Identifier: function Identifier(path, state) {
      if (path.node.name === "arguments" && util.isReference(path)) {
        util.replaceWithOrRemove(path, state.argsId);
        state.didRenameArguments = true;
      }
    }
  };
  var functionSentVisitor = {MetaProperty: function MetaProperty(path) {
      var node = path.node;
      if (node.meta.name === "function" && node.property.name === "sent") {
        util.replaceWithOrRemove(path, t.memberExpression(this.context, t.identifier("_sent")));
      }
    }};
  var awaitVisitor = {
    Function: function Function(path) {
      path.skip();
    },
    AwaitExpression: function AwaitExpression(path) {
      var argument = path.node.argument;
      util.replaceWithOrRemove(path, t.yieldExpression(t.callExpression(util.runtimeProperty("awrap"), [argument]), false));
    }
  };
})(require('process'));
