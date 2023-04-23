"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageJsonProvider = void 0;
var PackageJsonProvider = /** @class */ (function () {
    function PackageJsonProvider(state) {
        this.state = state;
        var currentDir = this.state.program.getCurrentDirectory();
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        this.packageJson = require("".concat(currentDir, "/package.json"));
    }
    PackageJsonProvider.prototype.queryField = function (field) {
        return this.packageJson[field];
    };
    return PackageJsonProvider;
}());
exports.PackageJsonProvider = PackageJsonProvider;
