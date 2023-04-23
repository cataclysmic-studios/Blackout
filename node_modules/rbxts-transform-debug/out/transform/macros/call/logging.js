"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMacro = exports.WarnMacro = exports.PrintMacro = void 0;
var typescript_1 = require("typescript");
var shared_1 = require("../../../util/shared");
exports.PrintMacro = {
    getSymbol: function (state) {
        return state.symbolProvider.moduleFile.get("$print");
    },
    transform: function (state, node) {
        return typescript_1.factory.updateCallExpression(node, typescript_1.factory.createIdentifier("print"), undefined, __spreadArray([
            (0, shared_1.createDebugPrefixLiteral)(node)
        ], node.arguments, true));
    },
};
exports.WarnMacro = {
    getSymbol: function (state) {
        return state.symbolProvider.moduleFile.get("$warn");
    },
    transform: function (state, node) {
        return typescript_1.factory.updateCallExpression(node, typescript_1.factory.createIdentifier("warn"), undefined, __spreadArray([
            (0, shared_1.createDebugPrefixLiteral)(node)
        ], node.arguments, true));
    },
};
exports.ErrorMacro = {
    getSymbol: function (state) {
        return state.symbolProvider.moduleFile.get("$error");
    },
    transform: function (state, node) {
        return typescript_1.factory.updateCallExpression(node, typescript_1.factory.createIdentifier("error"), undefined, __spreadArray([
            (0, shared_1.createErrorPrefixLiteral)(node)
        ], node.arguments.slice(1), true));
    },
};
