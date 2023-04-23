"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformExpression = void 0;
var typescript_1 = __importDefault(require("typescript"));
var transformBinaryExpression_1 = require("./expressions/transformBinaryExpression");
var transformCallExpression_1 = require("./expressions/transformCallExpression");
var transformIdentifier_1 = require("./expressions/transformIdentifier");
var transformNode_1 = require("./transformNode");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var TRANSFORMERS = new Map([
    [typescript_1.default.SyntaxKind.CallExpression, transformCallExpression_1.transformCallExpression],
    [typescript_1.default.SyntaxKind.BinaryExpression, transformBinaryExpression_1.transformBinaryExpression],
    [typescript_1.default.SyntaxKind.Identifier, transformIdentifier_1.transformIdentifier],
]);
function transformExpression(state, expression) {
    var transformer = TRANSFORMERS.get(expression.kind);
    if (transformer) {
        return transformer(state, expression);
    }
    return typescript_1.default.visitEachChild(expression, function (newNode) { return (0, transformNode_1.transformNode)(state, newNode); }, state.context);
}
exports.transformExpression = transformExpression;
