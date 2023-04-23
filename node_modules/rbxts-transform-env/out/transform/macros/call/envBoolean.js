"use strict";
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
exports.EnvCallAsBooleanMacro = exports.getEnvDefaultValue = void 0;
var assert_1 = __importDefault(require("assert"));
var typescript_1 = __importDefault(require("typescript"));
var toAst_1 = require("../../../util/toAst");
function getEnvDefaultValue(expression) {
    var _a = __read(expression.arguments, 2), defaultArgument = _a[1];
    if (defaultArgument !== undefined && typescript_1.default.isBooleanLiteral(defaultArgument)) {
        return defaultArgument.kind === typescript_1.default.SyntaxKind.TrueKeyword;
    }
}
exports.getEnvDefaultValue = getEnvDefaultValue;
exports.EnvCallAsBooleanMacro = {
    getSymbol: function (state) {
        var _a;
        var envSymbol = (_a = state.symbolProvider.moduleFile) === null || _a === void 0 ? void 0 : _a.envNamespace;
        (0, assert_1.default)(envSymbol, "Could not find env macro symbol");
        return envSymbol.get("boolean");
    },
    transform: function (state, callExpression) {
        var _a;
        var environment = state.environmentProvider;
        var _b = __read(callExpression.arguments, 1), variableArg = _b[0];
        if (typescript_1.default.isStringLiteral(variableArg)) {
            var variableName = variableArg.text;
            var variableValue = environment.parseAsBoolean(variableName);
            if (variableValue === undefined) {
                variableValue = (_a = getEnvDefaultValue(callExpression)) !== null && _a !== void 0 ? _a : false;
            }
            var value = variableValue;
            var expression = (0, toAst_1.toExpression)(value);
            if (expression !== undefined) {
                return expression;
            }
        }
        throw "Not supported: ".concat(callExpression.getText(), " - should use string literal");
    },
};
