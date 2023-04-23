"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitStatusProvider = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var git_repo_info_1 = __importDefault(require("git-repo-info"));
var chalk_1 = __importDefault(require("chalk"));
var GitStatusProvider = /** @class */ (function () {
    function GitStatusProvider(state) {
        this.state = state;
        this.tracked = false;
        this.props = {};
        var currentDir = this.state.program.getCurrentDirectory();
        if (fs_1.default.existsSync(path_1.default.join(currentDir, ".git"))) {
            this.tracked = true;
        }
        var repoInfo = (0, git_repo_info_1.default)();
        this.repoInfo = repoInfo;
        this.unixTimestamp = Math.round(repoInfo.authorDate ? new Date(repoInfo.authorDate).getTime() / 1000 : new Date().getTime() / 1000);
    }
    GitStatusProvider.prototype.isTracked = function () {
        return this.tracked;
    };
    GitStatusProvider.prototype.query = function (gitQuery) {
        var _a, _b, _c, _d;
        var repoInfo = this.repoInfo;
        var prop = this.props[gitQuery];
        if (prop !== undefined) {
            return prop;
        }
        this.state.logger.infoIfVerbose("Query once: Git repository for '" + chalk_1.default.yellow(gitQuery) + "'");
        switch (gitQuery) {
            case "branch": {
                var branch = (_a = repoInfo.branch) !== null && _a !== void 0 ? _a : "";
                this.props.branch = branch;
                return branch;
            }
            case "commit": {
                var commit = (_b = repoInfo.sha) !== null && _b !== void 0 ? _b : "";
                this.props.commit = commit;
                return commit;
            }
            case "unixTimestamp":
            case "isoTimestamp": {
                var dateString = (_c = repoInfo.authorDate) !== null && _c !== void 0 ? _c : new Date().toISOString();
                var unixTimestamp = this.unixTimestamp;
                this.props.unixTimestamp = unixTimestamp;
                this.props.isoTimestamp = dateString;
                return this.props[gitQuery];
            }
            case "latestTag": {
                var tag = (_d = repoInfo.lastTag) !== null && _d !== void 0 ? _d : "";
                this.props.latestTag = tag;
                return tag;
            }
            default:
                throw "not implemented: ".concat(gitQuery);
        }
    };
    return GitStatusProvider;
}());
exports.GitStatusProvider = GitStatusProvider;
