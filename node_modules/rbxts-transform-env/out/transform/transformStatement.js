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
exports.transformStatement = exports.transformShortcutIfLiterals = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
var typescript_1 = __importStar(require("typescript"));
var transformNode_1 = require("./transformNode");
function transformShortcutIfLiterals(state, statement) {
    var _a;
    if (typescript_1.default.isIfStatement(statement)) {
        if (typescript_1.default.isBooleanLiteral(statement.expression)) {
            switch (statement.expression.kind) {
                case typescript_1.SyntaxKind.TrueKeyword:
                    statement = statement.thenStatement;
                    break;
                case typescript_1.SyntaxKind.FalseKeyword:
                    statement = (_a = statement.elseStatement) !== null && _a !== void 0 ? _a : typescript_1.factory.createEmptyStatement();
                    break;
            }
        }
    }
    return statement;
}
exports.transformShortcutIfLiterals = transformShortcutIfLiterals;
function transformStatement(state, statement) {
    return transformShortcutIfLiterals(state, typescript_1.default.visitEachChild(statement, function (newNode) { return (0, transformNode_1.transformNode)(state, newNode); }, state.context));
}
exports.transformStatement = transformStatement;
