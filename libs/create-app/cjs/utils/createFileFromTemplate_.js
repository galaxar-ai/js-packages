"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _sys = require("@galaxar/sys");
const _utils = require("@galaxar/utils");
const createFileFromTempalte_ = async (templateFile, destFile, variables)=>{
    let templateContent = await _sys.fs.readFile(templateFile, 'utf8');
    let content = (0, _utils.template)(templateContent, variables);
    await _sys.fs.outputFile(destFile, content, 'utf8');
};
const _default = createFileFromTempalte_;

//# sourceMappingURL=createFileFromTemplate_.js.map