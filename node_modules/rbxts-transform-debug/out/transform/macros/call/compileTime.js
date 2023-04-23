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
exports.CompileTimeMacro = void 0;
var typescript_1 = __importStar(require("typescript"));
exports.CompileTimeMacro = {
    getSymbol: function (state) {
        return state.symbolProvider.moduleFile.get("$compileTime");
    },
    transform: function (state, node) {
        var typeName = "UnixTimestamp";
        var kindName = node.arguments[0];
        if (kindName !== undefined && typescript_1.default.isStringLiteral(kindName)) {
            typeName = kindName.text;
        }
        switch (typeName) {
            case "DateTime":
                return typescript_1.factory.createNonNullExpression(typescript_1.factory.createCallExpression(typescript_1.factory.createPropertyAccessExpression(typescript_1.factory.createIdentifier("DateTime"), "fromIsoDate"), undefined, [typescript_1.factory.createStringLiteral(new Date().toISOString())]));
            case "UnixTimestamp":
                return typescript_1.factory.createNumericLiteral(Math.floor(new Date().valueOf() / 1000));
            case "UnixTimestampMillis":
                return typescript_1.factory.createNumericLiteral(new Date().valueOf());
            case "ISO-8601":
                return typescript_1.factory.createStringLiteral(new Date().toISOString());
            default:
                throw "Invalid input";
        }
    },
};
