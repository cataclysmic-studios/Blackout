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
Object.defineProperty(exports, "__esModule", { value: true });
exports.toExpression = void 0;
var typescript_1 = require("typescript");
function toExpression(value) {
    var e_1, _a;
    if (typeof value === "boolean") {
        return value ? typescript_1.factory.createTrue() : typescript_1.factory.createFalse();
    }
    else if (typeof value === "number") {
        return typescript_1.factory.createNumericLiteral(value);
    }
    else if (typeof value === "string") {
        return typescript_1.factory.createStringLiteral(value);
    }
    else if (typeof value === "object" && value !== null) {
        if (Array.isArray(value)) {
            // TODO: Generate array!
        }
        else {
            // TODO: Generate object!
            var literalElements = new Array();
            try {
                for (var _b = __values(Object.entries(value)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), k = _d[0], v = _d[1];
                    var expression = toExpression(v);
                    if (expression !== undefined) {
                        literalElements.push(typescript_1.factory.createPropertyAssignment(typescript_1.factory.createStringLiteral(k), expression));
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
            return typescript_1.factory.createObjectLiteralExpression(literalElements, true);
        }
    }
    else if (value === undefined) {
        // throw formatTransformerDiagnostic(`Could not find value '${name}'`);
        return typescript_1.factory.createIdentifier("undefined");
    }
    else {
        throw "Unsupported in AST: ".concat(typeof value);
    }
}
exports.toExpression = toExpression;
