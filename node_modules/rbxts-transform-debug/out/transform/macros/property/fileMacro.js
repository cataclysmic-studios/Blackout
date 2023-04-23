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
exports.FilePropertyMacro = void 0;
var assert_1 = __importDefault(require("assert"));
var path_1 = __importDefault(require("path"));
var typescript_1 = __importStar(require("typescript"));
var shared_1 = require("../../../util/shared");
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
exports.FilePropertyMacro = {
    getSymbol: function (state) {
        var _a;
        var mod = (_a = state.symbolProvider.moduleFile) === null || _a === void 0 ? void 0 : _a.get("$file");
        (0, assert_1.default)(mod, "no $package symbol found");
        return mod;
    },
    transform: function (state, node) {
        var sourceFile = node.getSourceFile();
        var linePos = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        var relativePath = path_1.default
            .relative(state.program.getCurrentDirectory(), sourceFile.fileName)
            .replace(/\\/g, "/");
        var name = resolveName(node);
        switch (name.text) {
            case "filePath":
                return typescript_1.factory.createStringLiteral(relativePath);
            case "lineNumber":
                return typescript_1.factory.createNumericLiteral(linePos.line + 1);
            default:
                throw (0, shared_1.formatTransformerDiagnostic)("Unknown file property: ".concat(name.text), node);
        }
    },
};
