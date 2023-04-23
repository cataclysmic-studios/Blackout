"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformFile = void 0;
var typescript_1 = require("typescript");
var transformStatementList_1 = require("./transformStatementList");
function transformFile(state, file) {
    var statements = (0, transformStatementList_1.transformStatementList)(state, file.statements);
    var sourceFile = typescript_1.factory.updateSourceFile(file, statements);
    return sourceFile;
}
exports.transformFile = transformFile;
