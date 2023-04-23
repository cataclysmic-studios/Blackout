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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackagePropertyMacro = void 0;
var assert_1 = __importDefault(require("assert"));
var typescript_1 = __importStar(require("typescript"));
var shared_1 = require("../../../util/shared");
var toAst_1 = require("../../../util/toAst");
function getRelativePath(state, packageJson, expression) {
    var _a;
    var packageSymbol = (_a = state.symbolProvider.moduleFile) === null || _a === void 0 ? void 0 : _a.get("$package");
    if (typescript_1.default.isIdentifier(expression)) {
        var symbol = state.getSymbol(expression);
        if (symbol === packageSymbol) {
            return packageJson.packageJson;
        }
    }
}
function resolveName(value) {
    if (typescript_1.default.isPropertyAccessExpression(value)) {
        return value.name;
    }
    else {
        if (typescript_1.default.isIdentifier(value.argumentExpression)) {
            return value.argumentExpression;
        }
        else {
            throw (0, shared_1.formatTransformerDiagnostic)("Invalid macro access", value, "Try using a literal to access this property.");
        }
    }
}
exports.PackagePropertyMacro = {
    getSymbol: function (state) {
        var _a;
        var mod = (_a = state.symbolProvider.moduleFile) === null || _a === void 0 ? void 0 : _a.get("$package");
        (0, assert_1.default)(mod, "no $package symbol found");
        return mod;
    },
    transform: function (state, node) {
        var _a;
        var packageSymbol = (_a = state.symbolProvider.moduleFile) === null || _a === void 0 ? void 0 : _a.get("$package");
        (0, assert_1.default)(packageSymbol);
        var packageJson = state.packageJsonProvider;
        var name = resolveName(node);
        var value = packageJson.queryField(name.text);
        if (typeof value === "object") {
            var id = typescript_1.factory.createUniqueName(name.text);
            var expression = (0, toAst_1.toExpression)(value, name.text);
            if (expression) {
                state.prereqDeclaration(id, expression);
                return id;
            }
        }
        else {
            var expression = (0, toAst_1.toExpression)(value, name.text);
            if (expression) {
                return expression;
            }
        }
        return node;
    },
};
