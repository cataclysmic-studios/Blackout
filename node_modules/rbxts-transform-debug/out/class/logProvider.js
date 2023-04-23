"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerProvider = void 0;
var chalk_1 = __importDefault(require("chalk"));
var TRANSFORMER_NAME = "Debug";
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
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        if (!this.debug)
            return;
        for (var _a = 0, messages_1 = messages; _a < messages_1.length; _a++) {
            var message = messages_1[_a];
            var text = typeof message === "string" ? "".concat(message) : "".concat(JSON.stringify(message, undefined, "\t"));
            var prefix = "[".concat(chalk_1.default.gray(TRANSFORMER_NAME), "]: ");
            this.write("".concat(prefix).concat(text.replace(/\n/g, "\n".concat(prefix)), "\n"));
        }
    };
    LoggerProvider.prototype.writeLineIfVerbose = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        if (this.verbose)
            return this.writeLine.apply(this, messages);
    };
    LoggerProvider.prototype.info = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        this.writeLine.apply(this, messages.map(function (x) { return chalk_1.default.blue(x); }));
    };
    LoggerProvider.prototype.infoIfVerbose = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        if (this.verbose)
            return this.info.apply(this, messages);
    };
    LoggerProvider.prototype.warn = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        this.writeLine.apply(this, messages.map(function (x) { return chalk_1.default.yellow(x); }));
    };
    LoggerProvider.prototype.warnIfVerbose = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        if (this.verbose)
            return this.warn.apply(this, messages);
    };
    LoggerProvider.prototype.error = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        this.writeLine.apply(this, messages.map(function (x) { return chalk_1.default.red(x); }));
    };
    return LoggerProvider;
}());
exports.LoggerProvider = LoggerProvider;
