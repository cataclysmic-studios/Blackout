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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerProvider = void 0;
var chalk_1 = __importDefault(require("chalk"));
var TRANSFORMER_NAME = "Env";
var LoggerProvider = /** @class */ (function () {
    function LoggerProvider(debug, verbose) {
        this.debug = debug;
        this.verbose = verbose;
        // NOTHING YET
    }
    LoggerProvider.prototype.write = function (message) {
        process.stdout.write(message);
    };
    LoggerProvider.prototype.writeLine = function () {
        var e_1, _a;
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        if (!this.debug)
            return;
        try {
            for (var messages_1 = __values(messages), messages_1_1 = messages_1.next(); !messages_1_1.done; messages_1_1 = messages_1.next()) {
                var message = messages_1_1.value;
                var text = typeof message === "string" ? "".concat(message) : "".concat(JSON.stringify(message, undefined, "\t"));
                var prefix = "[".concat(chalk_1.default.gray(TRANSFORMER_NAME), "]: ");
                this.write("".concat(prefix).concat(text.replace(/\n/g, "\n".concat(prefix)), "\n"));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (messages_1_1 && !messages_1_1.done && (_a = messages_1.return)) _a.call(messages_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    LoggerProvider.prototype.writeLineIfVerbose = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        if (this.verbose)
            return this.writeLine.apply(this, __spreadArray([], __read(messages), false));
    };
    LoggerProvider.prototype.info = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        this.writeLine.apply(this, __spreadArray([], __read(messages.map(function (x) { return chalk_1.default.blue(x); })), false));
    };
    LoggerProvider.prototype.infoIfVerbose = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        if (this.verbose)
            return this.info.apply(this, __spreadArray([], __read(messages), false));
    };
    LoggerProvider.prototype.warn = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        this.writeLine.apply(this, __spreadArray([], __read(messages.map(function (x) { return chalk_1.default.yellow(x); })), false));
    };
    LoggerProvider.prototype.warnIfVerbose = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        if (this.verbose)
            return this.warn.apply(this, __spreadArray([], __read(messages), false));
    };
    LoggerProvider.prototype.error = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        this.writeLine.apply(this, __spreadArray([], __read(messages.map(function (x) { return chalk_1.default.red(x); })), false));
    };
    return LoggerProvider;
}());
exports.LoggerProvider = LoggerProvider;
