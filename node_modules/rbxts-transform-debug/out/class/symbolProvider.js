"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolProvider = exports.RBXTS_SYMBOL_NAMES = exports.moduleResolutionCache = void 0;
var path_1 = __importDefault(require("path"));
var typescript_1 = __importDefault(require("typescript"));
var fs_1 = __importDefault(require("fs"));
var isPathDescendantOf_1 = require("../util/isPathDescendantOf");
var assert_1 = __importDefault(require("assert"));
exports.moduleResolutionCache = new Map();
var FileSymbol = /** @class */ (function () {
    function FileSymbol(state, file) {
        this.state = state;
        this.file = file;
        var fileSymbol = this.state.getSymbol(file);
        (0, assert_1.default)(fileSymbol, "Invalid file symbol");
        this.fileSymbol = fileSymbol;
        this.register();
    }
    FileSymbol.prototype.get = function (name) {
        var _a;
        var exportSymbol = (_a = this.fileSymbol.exports) === null || _a === void 0 ? void 0 : _a.get(name);
        (0, assert_1.default)(exportSymbol);
        return exportSymbol;
    };
    FileSymbol.prototype.register = function () {
        // for (const statement of this.file.statements) {
        // 	if (ts.isFunctionDeclaration(statement)) {
        // 		this.registerFunction(statement);
        // 	}
        // }
    };
    return FileSymbol;
}());
exports.RBXTS_SYMBOL_NAMES = {
    LuaTuple: "LuaTuple",
};
var NOMINAL_LUA_TUPLE_NAME = "_nominal_LuaTuple";
var SymbolProvider = /** @class */ (function () {
    function SymbolProvider(state) {
        var _a, _b;
        this.state = state;
        this.symbols = new Map();
        this.typesDir = this.resolveModuleDir("@rbxts/types");
        this.debugDir = this.resolveModuleDir("rbxts-transform-debug");
        this.lookupModule();
        for (var _i = 0, _c = Object.values(exports.RBXTS_SYMBOL_NAMES); _i < _c.length; _i++) {
            var symbolName = _c[_i];
            var symbol = state.typeChecker.resolveName(symbolName, undefined, typescript_1.default.SymbolFlags.All, false);
            if (symbol) {
                this.symbols.set(symbolName, symbol);
            }
            else {
                throw "MacroManager could not find symbol for ".concat(symbolName);
            }
        }
        var luaTupleTypeDec = (_b = (_a = this.symbols
            .get(exports.RBXTS_SYMBOL_NAMES.LuaTuple)) === null || _a === void 0 ? void 0 : _a.declarations) === null || _b === void 0 ? void 0 : _b.find(function (v) { return typescript_1.default.isTypeAliasDeclaration(v); });
        if (luaTupleTypeDec) {
            var nominalLuaTupleSymbol = state.typeChecker
                .getTypeAtLocation(luaTupleTypeDec)
                .getProperty(NOMINAL_LUA_TUPLE_NAME);
            if (nominalLuaTupleSymbol) {
                this.symbols.set(NOMINAL_LUA_TUPLE_NAME, nominalLuaTupleSymbol);
            }
        }
    }
    SymbolProvider.prototype.isLuaTupleType = function (type) {
        return type.getProperty(NOMINAL_LUA_TUPLE_NAME) === this.symbols.get(NOMINAL_LUA_TUPLE_NAME);
    };
    SymbolProvider.prototype.getGlobalSymbolByNameOrThrow = function (typeChecker, name, meaning) {
        var symbol = typeChecker.resolveName(name, undefined, meaning, false);
        if (symbol) {
            return symbol;
        }
        throw "nooop";
    };
    SymbolProvider.prototype.isModule = function (file) {
        if ((0, isPathDescendantOf_1.isPathDescendantOf)(file.fileName, this.debugDir) &&
            !(0, isPathDescendantOf_1.isPathDescendantOf)(file.fileName, path_1.default.join(this.debugDir, "example"))) {
            return true;
        }
        else {
            return false;
        }
    };
    SymbolProvider.prototype.lookupModule = function () {
        for (var _i = 0, _a = this.state.program.getSourceFiles(); _i < _a.length; _i++) {
            var file = _a[_i];
            if (this.isModule(file)) {
                this.moduleFile = new FileSymbol(this.state, file);
            }
        }
    };
    SymbolProvider.prototype.resolveModuleDir = function (moduleName) {
        var modulePath = exports.moduleResolutionCache.get(moduleName);
        if (modulePath !== undefined)
            return modulePath || undefined;
        var dummyFile = path_1.default.join(this.state.srcDir, "dummy.ts");
        var module = typescript_1.default.resolveModuleName(moduleName, dummyFile, this.state.options, typescript_1.default.sys);
        var resolvedModule = module.resolvedModule;
        if (resolvedModule) {
            var modulePath_1 = fs_1.default.realpathSync(path_1.default.join(resolvedModule.resolvedFileName, "../"));
            exports.moduleResolutionCache.set(moduleName, modulePath_1);
            return modulePath_1;
        }
        exports.moduleResolutionCache.set(moduleName, false);
    };
    return SymbolProvider;
}());
exports.SymbolProvider = SymbolProvider;
