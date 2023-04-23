"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
var typescript_1 = __importDefault(require("typescript"));
var transformState_1 = require("./class/transformState");
var transformFile_1 = require("./transform/transformFile");
var logProvider_1 = require("./class/logProvider");
var DEFAULTS = {
    verbose: false,
    defaultEnvironment: "production",
    shortCircuitNodeEnv: true,
};
function transform(program, userConfiguration) {
    userConfiguration = __assign(__assign({}, DEFAULTS), userConfiguration);
    if (process.argv.includes("--verbose")) {
        userConfiguration.verbose = true;
    }
    var logger = new logProvider_1.LoggerProvider(userConfiguration.verbose, userConfiguration.verbose);
    if (logger.verbose) {
        logger.write("\n");
    }
    logger.infoIfVerbose("Loaded environment transformer");
    return function (context) {
        var state = new transformState_1.TransformState(program, context, userConfiguration, logger);
        if (state.symbolProvider.moduleFile === undefined) {
            return function (file) { return file; };
        }
        return function (file) {
            var e_1, _a;
            var printFile = false;
            var leading = typescript_1.default.getLeadingCommentRanges(file.getFullText(), 0);
            if (leading) {
                var metaComment = "// @rbxts-transform-env";
                var srcFileText = file.getFullText();
                try {
                    for (var leading_1 = __values(leading), leading_1_1 = leading_1.next(); !leading_1_1.done; leading_1_1 = leading_1.next()) {
                        var leadingComment = leading_1_1.value;
                        var comment = srcFileText.substring(leadingComment.pos, leadingComment.end);
                        if (comment.startsWith(metaComment)) {
                            var metaTags = comment.substring(metaComment.length + 1).split(" ");
                            if (metaTags.includes("debug:print_file")) {
                                printFile = true;
                            }
                            break;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (leading_1_1 && !leading_1_1.done && (_a = leading_1.return)) _a.call(leading_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            var result = (0, transformFile_1.transformFile)(state, file);
            if (printFile) {
                var printer = typescript_1.default.createPrinter({});
                console.log(printer.printFile(result));
            }
            return result;
        };
    };
}
exports.default = transform;
