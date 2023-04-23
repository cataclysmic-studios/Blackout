"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvCallAsStringMacro = exports.getEnvDefaultValue = void 0;
var assert_1 = __importDefault(require("assert"));
var typescript_1 = __importStar(require("typescript"));
var toAst_1 = require("../../../util/toAst");
function getEnvDefaultValue(expression) {
    var _a = __read(expression.arguments, 2), defaultArgument = _a[1];
    if (defaultArgument !== undefined &&
        (typescript_1.default.isStringLiteral(defaultArgument) || typescript_1.default.isNumericLiteral(defaultArgument))) {
        return typescript_1.factory.createStringLiteral(defaultArgument.text);
    }
    else if (defaultArgument !== undefined && typescript_1.default.isTemplateLiteral(defaultArgument)) {
        return defaultArgument;
    }
}
exports.getEnvDefaultValue = getEnvDefaultValue;
exports.EnvCallAsStringMacro = {
    getSymbol: function (state) {
        var _a;
        var envSymbol = (_a = state.symbolProvider.moduleFile) === null || _a === void 0 ? void 0 : _a.envNamespace;
        (0, assert_1.default)(envSymbol, "Could not find env macro symbol");
        return envSymbol.get("string");
    },
    transform: function (state, callExpression) {
        var _a;
        var environment = state.environmentProvider;
        var _b = __read(callExpression.arguments, 2), variableArg = _b[0], variableDefault = _b[1];
        var printer = typescript_1.default.createPrinter({});
        if (typescript_1.default.isStringLiteral(variableArg)) {
            var variableName = variableArg.text;
            var variableValue = environment.get(variableName);
            var expression = (_a = (variableValue !== undefined ? (0, toAst_1.toExpression)(variableValue) : getEnvDefaultValue(callExpression))) !== null && _a !== void 0 ? _a : typescript_1.factory.createIdentifier("undefined");
            if (state.config.verbose) {
                state.logger.infoIfVerbose("Transform variable ".concat(variableName, " to ").concat(printer.printNode(typescript_1.default.EmitHint.Expression, expression, callExpression.getSourceFile())));
                console.log("\t", callExpression.getSourceFile().fileName);
            }
            // console.log(variableName, ts.SyntaxKind[expression.kind]);
            if (typescript_1.default.isIfStatement(callExpression.parent) || typescript_1.default.isBinaryExpression(callExpression.parent)) {
                var prereqId = typescript_1.factory.createUniqueName(variableName);
                state.prereqDeclaration(prereqId, expression, variableDefault === undefined
                    ? typescript_1.factory.createUnionTypeNode([
                        typescript_1.factory.createTypeReferenceNode("string"),
                        typescript_1.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.UndefinedKeyword),
                    ])
                    : typescript_1.factory.createTypeReferenceNode("string"));
                return prereqId;
            }
            else if (typescript_1.default.isVariableDeclaration(callExpression.parent)) {
                if (variableDefault === undefined) {
                    return typescript_1.factory.createAsExpression(expression, typescript_1.factory.createUnionTypeNode([
                        typescript_1.factory.createTypeReferenceNode("string"),
                        typescript_1.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.UndefinedKeyword),
                    ]));
                }
                else {
                    return typescript_1.factory.createAsExpression(expression, typescript_1.factory.createTypeReferenceNode("string"));
                }
            }
            if (expression !== undefined) {
                return expression;
            }
        }
        throw "Not supported: ".concat(callExpression.getText(), " - should use string literal");
    },
};
