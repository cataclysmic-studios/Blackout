"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformState = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
var typescript_1 = __importDefault(require("typescript"));
var typescript_2 = require("typescript");
var call_1 = require("../transform/macros/call");
var property_1 = require("../transform/macros/property");
var gitStatusProvider_1 = require("./gitStatusProvider");
var packageJsonProvider_1 = require("./packageJsonProvider");
var symbolProvider_1 = require("./symbolProvider");
var TransformState = /** @class */ (function () {
    function TransformState(program, context, config, logger) {
        var _a, _b, _c, _d;
        this.program = program;
        this.context = context;
        this.config = config;
        this.logger = logger;
        this.isMacrosSetup = false;
        this.callMacros = new Map();
        this.propertyMacros = new Map();
        this.options = this.program.getCompilerOptions();
        this.srcDir = (_a = this.options.rootDir) !== null && _a !== void 0 ? _a : this.program.getCurrentDirectory();
        this.baseDir = (_c = (_b = this.options.baseUrl) !== null && _b !== void 0 ? _b : this.options.configFilePath) !== null && _c !== void 0 ? _c : this.program.getCurrentDirectory();
        this.tsconfigFile = (_d = this.options.configFilePath) !== null && _d !== void 0 ? _d : this.program.getCurrentDirectory();
        this.prereqStack = new Array();
        this.typeChecker = program.getTypeChecker();
        this.symbolProvider = new symbolProvider_1.SymbolProvider(this);
        this.gitProvider = new gitStatusProvider_1.GitStatusProvider(this);
        this.packageJsonProvider = new packageJsonProvider_1.PackageJsonProvider(this);
        this.initMacros();
    }
    TransformState.prototype.initMacros = function () {
        if (this.isMacrosSetup)
            return;
        if (!this.symbolProvider.moduleFile)
            return;
        this.isMacrosSetup = true;
        for (var _i = 0, CALL_MACROS_1 = call_1.CALL_MACROS; _i < CALL_MACROS_1.length; _i++) {
            var macro = CALL_MACROS_1[_i];
            var symbols = macro.getSymbol(this);
            if (Array.isArray(symbols)) {
                for (var _a = 0, symbols_1 = symbols; _a < symbols_1.length; _a++) {
                    var symbol = symbols_1[_a];
                    this.callMacros.set(symbol, macro);
                }
            }
            else {
                this.callMacros.set(symbols, macro);
            }
        }
        for (var _b = 0, PROPERTY_MACROS_1 = property_1.PROPERTY_MACROS; _b < PROPERTY_MACROS_1.length; _b++) {
            var macro = PROPERTY_MACROS_1[_b];
            var symbols = macro.getSymbol(this);
            if (Array.isArray(symbols)) {
                for (var _c = 0, symbols_2 = symbols; _c < symbols_2.length; _c++) {
                    var symbol = symbols_2[_c];
                    this.propertyMacros.set(symbol, macro);
                }
            }
            else {
                this.propertyMacros.set(symbols, macro);
            }
        }
    };
    TransformState.prototype.getCallMacro = function (symbol) {
        return this.callMacros.get(symbol);
    };
    TransformState.prototype.getPropertyMacro = function (symbol) {
        return this.propertyMacros.get(symbol);
    };
    TransformState.prototype.getSymbol = function (node, followAlias) {
        if (followAlias === void 0) { followAlias = true; }
        var symbol = this.typeChecker.getSymbolAtLocation(node);
        if (symbol && followAlias) {
            return typescript_1.default.skipAlias(symbol, this.typeChecker);
        }
        else {
            return symbol;
        }
    };
    TransformState.prototype.capture = function (cb) {
        this.prereqStack.push([]);
        var result = cb();
        return [result, this.prereqStack.pop()];
    };
    TransformState.prototype.prereq = function (statement) {
        var stack = this.prereqStack[this.prereqStack.length - 1];
        if (stack)
            stack.push(statement);
    };
    TransformState.prototype.prereqList = function (statements) {
        var stack = this.prereqStack[this.prereqStack.length - 1];
        if (stack)
            stack.push.apply(stack, statements);
    };
    TransformState.prototype.prereqDeclaration = function (id, value, type) {
        this.prereq(typescript_2.factory.createVariableStatement(undefined, typescript_2.factory.createVariableDeclarationList([typescript_2.factory.createVariableDeclaration(id, undefined, type, value)], typescript_1.default.NodeFlags.Const)));
    };
    return TransformState;
}());
exports.TransformState = TransformState;
