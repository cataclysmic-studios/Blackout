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
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformBinaryExpression = void 0;
var typescript_1 = __importStar(require("typescript"));
var transformNode_1 = require("../transformNode");
function transformBinaryExpression(state, node) {
    var _a;
    if (state.config.shortCircuitNodeEnv) {
        var nodeEnvConstant = (_a = state.symbolProvider.moduleFile) === null || _a === void 0 ? void 0 : _a.nodeEnvConstant;
        var leftSymbol = state.getSymbol(node.left);
        var rightSymbol = state.getSymbol(node.right);
        if (leftSymbol === nodeEnvConstant) {
            if (typescript_1.default.isStringLiteral(node.right)) {
                return node.right.text === state.environmentProvider.nodeEnvironment
                    ? typescript_1.factory.createTrue()
                    : typescript_1.factory.createFalse();
            }
        }
        else if (rightSymbol === nodeEnvConstant) {
            if (typescript_1.default.isStringLiteral(node.left)) {
                return node.left.text === state.environmentProvider.nodeEnvironment
                    ? typescript_1.factory.createTrue()
                    : typescript_1.factory.createFalse();
            }
        }
    }
    return typescript_1.default.visitEachChild(node, function (node) { return (0, transformNode_1.transformNode)(state, node); }, state.context);
}
exports.transformBinaryExpression = transformBinaryExpression;
