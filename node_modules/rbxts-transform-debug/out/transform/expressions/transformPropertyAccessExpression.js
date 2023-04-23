"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformPropertyAccessExpression = void 0;
var typescript_1 = __importDefault(require("typescript"));
var transformNode_1 = require("../transformNode");
function transformPropertyAccessExpression(state, node) {
    var symbol = state.getSymbol(node.expression);
    if (symbol !== undefined) {
        var macro = state.getPropertyMacro(symbol);
        if (macro) {
            return macro.transform(state, node, { symbol: symbol, symbols: [symbol] });
        }
    }
    return typescript_1.default.visitEachChild(node, function (node) { return (0, transformNode_1.transformNode)(state, node); }, state.context);
}
exports.transformPropertyAccessExpression = transformPropertyAccessExpression;
