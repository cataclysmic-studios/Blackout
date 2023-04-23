"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolProvider = exports.moduleResolutionCache = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
var path_1 = __importDefault(require("path"));
var typescript_1 = __importDefault(require("typescript"));
var fs_1 = __importDefault(require("fs"));
var isPathDescendantOf_1 = require("../util/isPathDescendantOf");
var assert_1 = __importDefault(require("assert"));
exports.moduleResolutionCache = new Map();
var NamespaceSymbol = /** @class */ (function () {
    function NamespaceSymbol(fileSymbol) {
        this.fileSymbol = fileSymbol;
        var namespaceSymbol = fileSymbol.get("$env");
        this.namespaceSymbol = namespaceSymbol;
    }
    NamespaceSymbol.prototype.get = function (name) {
        var _a;
        var exportSymbol = (_a = this.namespaceSymbol.exports) === null || _a === void 0 ? void 0 : _a.get(name);
        (0, assert_1.default)(exportSymbol, "No file export by the name " + name);
        return exportSymbol;
    };
    return NamespaceSymbol;
}());
var FileSymbol = /** @class */ (function () {
    function FileSymbol(state, file) {
        this.state = state;
        this.file = file;
        var fileSymbol = this.state.getSymbol(file);
        (0, assert_1.default)(fileSymbol, "Invalid file symbol");
        this.fileSymbol = fileSymbol;
        this.nodeEnvConstant = this.get("$NODE_ENV");
        this.envNamespace = new NamespaceSymbol(this);
    }
    FileSymbol.prototype.get = function (name) {
        var _a;
        var exportSymbol = (_a = this.fileSymbol.exports) === null || _a === void 0 ? void 0 : _a.get(name);
        (0, assert_1.default)(exportSymbol, "No file export by the name " + name);
        return exportSymbol;
    };
    return FileSymbol;
}());
var SymbolProvider = /** @class */ (function () {
    function SymbolProvider(state) {
        this.state = state;
        this.envDir = this.resolveModuleDir("rbxts-transform-env");
        this.lookupModule();
    }
    SymbolProvider.prototype.isModule = function (file) {
        if (!this.envDir) {
            return false;
        }
        if ((0, isPathDescendantOf_1.isPathDescendantOf)(file.fileName, this.envDir) &&
            !(0, isPathDescendantOf_1.isPathDescendantOf)(file.fileName, path_1.default.join(this.envDir, "example"))) {
            return true;
        }
        else {
            return false;
        }
    };
    SymbolProvider.prototype.lookupModule = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.state.program.getSourceFiles()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var file = _c.value;
                if (this.isModule(file)) {
                    this.moduleFile = new FileSymbol(this.state, file);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
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
