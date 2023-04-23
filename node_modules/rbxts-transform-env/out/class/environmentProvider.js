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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentProvider = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var EnvironmentProvider = /** @class */ (function () {
    function EnvironmentProvider(state) {
        var e_1, _a;
        var _b;
        this.state = state;
        this.variables = new Map();
        var variables = dotenv_1.default.config();
        this.nodeEnvironment = (_b = process.env.NODE_ENV) !== null && _b !== void 0 ? _b : state.config.defaultEnvironment;
        if (variables) {
            try {
                for (var _c = __values(Object.entries(process.env)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var _e = __read(_d.value, 2), name_1 = _e[0], value = _e[1];
                    this.variables.set(name_1, value);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        if (!this.variables.has("NODE_ENV")) {
            this.variables.set("NODE_ENV", this.nodeEnvironment);
        }
        var varCount = this.variables.size;
        state.logger.infoIfVerbose("Fetched " + varCount + " environment variables from session");
    }
    EnvironmentProvider.prototype.get = function (name) {
        return this.variables.get(name);
    };
    EnvironmentProvider.prototype.getAsNumber = function (name) {
        var value = this.get(name);
        if (value && value.match(/\d+/gi)) {
            return parseFloat(value);
        }
    };
    EnvironmentProvider.prototype.parseAsBoolean = function (name) {
        var value = this.get(name);
        if (value) {
            return value.trim().toLowerCase() !== "false";
        }
        else {
            return undefined;
        }
    };
    return EnvironmentProvider;
}());
exports.EnvironmentProvider = EnvironmentProvider;
