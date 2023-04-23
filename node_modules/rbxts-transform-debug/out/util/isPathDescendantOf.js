"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPathDescendantOf = void 0;
var path_1 = __importDefault(require("path"));
/**
 * Checks if the `filePath` path is a descendant of the `dirPath` path.
 * @param filePath A path to a file.
 * @param dirPath A path to a directory.
 */
function isPathDescendantOf(filePath, dirPath) {
    return dirPath === filePath || !path_1.default.relative(dirPath, filePath).startsWith("..");
}
exports.isPathDescendantOf = isPathDescendantOf;
