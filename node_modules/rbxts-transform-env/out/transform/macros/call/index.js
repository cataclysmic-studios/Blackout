"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CALL_MACROS = void 0;
var env_1 = require("./env");
var envBoolean_1 = require("./envBoolean");
var envNumber_1 = require("./envNumber");
exports.CALL_MACROS = new Array(envNumber_1.EnvCallAsNumberMacro, env_1.EnvCallAsStringMacro, envBoolean_1.EnvCallAsBooleanMacro);
