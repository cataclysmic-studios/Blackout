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
exports.NodeEnvMacro = void 0;
var assert_1 = __importDefault(require("assert"));
var typescript_1 = __importStar(require("typescript"));
exports.NodeEnvMacro = {
    getSymbol: function (state) {
        var _a;
        var envSymbol = (_a = state.symbolProvider.moduleFile) === null || _a === void 0 ? void 0 : _a.nodeEnvConstant;
        (0, assert_1.default)(envSymbol, "Could not find env macro symbol");
        return envSymbol;
    },
    transform: function (state, node) {
        if (typescript_1.default.isImportSpecifier(node.parent)) {
            return node;
        }
        return typescript_1.factory.createAsExpression(typescript_1.factory.createStringLiteral(state.environmentProvider.nodeEnvironment), typescript_1.factory.createTypeReferenceNode("string"));
    },
};
