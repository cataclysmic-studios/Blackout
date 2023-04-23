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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
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
exports.TransformState = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
var typescript_1 = __importStar(require("typescript"));
var call_1 = require("../transform/macros/call");
var identifier_1 = require("../transform/macros/identifier");
var property_1 = require("../transform/macros/property");
var environmentProvider_1 = require("./environmentProvider");
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
        this.identifierMacros = new Map();
        this.options = this.program.getCompilerOptions();
        this.srcDir = (_a = this.options.rootDir) !== null && _a !== void 0 ? _a : this.program.getCurrentDirectory();
        this.baseDir = (_c = (_b = this.options.baseUrl) !== null && _b !== void 0 ? _b : this.options.configFilePath) !== null && _c !== void 0 ? _c : this.program.getCurrentDirectory();
        this.tsconfigFile = (_d = this.options.configFilePath) !== null && _d !== void 0 ? _d : this.program.getCurrentDirectory();
        this.prereqId = new Map();
        this.prereqStack = new Array();
        this.typeChecker = program.getTypeChecker();
        this.symbolProvider = new symbolProvider_1.SymbolProvider(this);
        this.environmentProvider = new environmentProvider_1.EnvironmentProvider(this);
        this.initMacros();
    }
    TransformState.prototype.initMacros = function () {
        var e_1, _a, e_2, _b, e_3, _c, e_4, _d, e_5, _e, e_6, _f;
        if (this.isMacrosSetup)
            return;
        if (!this.symbolProvider.moduleFile)
            return; // skip over not being used
        this.isMacrosSetup = true;
        try {
            for (var CALL_MACROS_1 = __values(call_1.CALL_MACROS), CALL_MACROS_1_1 = CALL_MACROS_1.next(); !CALL_MACROS_1_1.done; CALL_MACROS_1_1 = CALL_MACROS_1.next()) {
                var macro = CALL_MACROS_1_1.value;
                var symbols = macro.getSymbol(this);
                if (Array.isArray(symbols)) {
                    try {
                        for (var symbols_1 = (e_2 = void 0, __values(symbols)), symbols_1_1 = symbols_1.next(); !symbols_1_1.done; symbols_1_1 = symbols_1.next()) {
                            var symbol = symbols_1_1.value;
                            this.callMacros.set(symbol, macro);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (symbols_1_1 && !symbols_1_1.done && (_b = symbols_1.return)) _b.call(symbols_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                else {
                    this.callMacros.set(symbols, macro);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (CALL_MACROS_1_1 && !CALL_MACROS_1_1.done && (_a = CALL_MACROS_1.return)) _a.call(CALL_MACROS_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var PROPERTY_MACROS_1 = __values(property_1.PROPERTY_MACROS), PROPERTY_MACROS_1_1 = PROPERTY_MACROS_1.next(); !PROPERTY_MACROS_1_1.done; PROPERTY_MACROS_1_1 = PROPERTY_MACROS_1.next()) {
                var macro = PROPERTY_MACROS_1_1.value;
                var symbols = macro.getSymbol(this);
                if (Array.isArray(symbols)) {
                    try {
                        for (var symbols_2 = (e_4 = void 0, __values(symbols)), symbols_2_1 = symbols_2.next(); !symbols_2_1.done; symbols_2_1 = symbols_2.next()) {
                            var symbol = symbols_2_1.value;
                            this.propertyMacros.set(symbol, macro);
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (symbols_2_1 && !symbols_2_1.done && (_d = symbols_2.return)) _d.call(symbols_2);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                }
                else {
                    this.propertyMacros.set(symbols, macro);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (PROPERTY_MACROS_1_1 && !PROPERTY_MACROS_1_1.done && (_c = PROPERTY_MACROS_1.return)) _c.call(PROPERTY_MACROS_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        try {
            for (var IDENTIFIER_MACROS_1 = __values(identifier_1.IDENTIFIER_MACROS), IDENTIFIER_MACROS_1_1 = IDENTIFIER_MACROS_1.next(); !IDENTIFIER_MACROS_1_1.done; IDENTIFIER_MACROS_1_1 = IDENTIFIER_MACROS_1.next()) {
                var macro = IDENTIFIER_MACROS_1_1.value;
                var symbols = macro.getSymbol(this);
                if (Array.isArray(symbols)) {
                    try {
                        for (var symbols_3 = (e_6 = void 0, __values(symbols)), symbols_3_1 = symbols_3.next(); !symbols_3_1.done; symbols_3_1 = symbols_3.next()) {
                            var symbol = symbols_3_1.value;
                            this.identifierMacros.set(symbol, macro);
                        }
                    }
                    catch (e_6_1) { e_6 = { error: e_6_1 }; }
                    finally {
                        try {
                            if (symbols_3_1 && !symbols_3_1.done && (_f = symbols_3.return)) _f.call(symbols_3);
                        }
                        finally { if (e_6) throw e_6.error; }
                    }
                }
                else {
                    this.identifierMacros.set(symbols, macro);
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (IDENTIFIER_MACROS_1_1 && !IDENTIFIER_MACROS_1_1.done && (_e = IDENTIFIER_MACROS_1.return)) _e.call(IDENTIFIER_MACROS_1);
            }
            finally { if (e_5) throw e_5.error; }
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
        var lastStack = this.prereqStack.pop();
        if (this.prereqStack.length === 0) {
            this.prereqId.clear();
        }
        return [result, lastStack];
    };
    TransformState.prototype.prereq = function (statement) {
        var stack = this.prereqStack[this.prereqStack.length - 1];
        if (stack)
            stack.push(statement);
    };
    TransformState.prototype.prereqList = function (statements) {
        var stack = this.prereqStack[this.prereqStack.length - 1];
        if (stack)
            stack.push.apply(stack, __spreadArray([], __read(statements), false));
    };
    TransformState.prototype.prereqDeclaration = function (id, value, type) {
        this.prereq(typescript_1.factory.createVariableStatement(undefined, typescript_1.factory.createVariableDeclarationList([typescript_1.factory.createVariableDeclaration(id, undefined, type, value)], typescript_1.default.NodeFlags.Let)));
    };
    return TransformState;
}());
exports.TransformState = TransformState;
