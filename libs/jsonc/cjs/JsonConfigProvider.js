"use strict";Object.defineProperty(exports,"__esModule",{value:true});Object.defineProperty(exports,"default",{enumerable:true,get:function(){return _default}});const _lodash=_interop_require_default(require("lodash"));const _nodepath=_interop_require_default(require("node:path"));const _promises=require("node:fs/promises");function _interop_require_default(obj){return obj&&obj.__esModule?obj:{default:obj}}class JsonConfigProvider{async load_(logger,noThrow){try{this.config=JSON.parse(await (0,_promises.readFile)(this.filePath,"utf-8"))}catch(error){if(noThrow){return undefined}throw error}logger?.log("info",`Configuration is loaded from "${_nodepath.default.relative(process.cwd(),this.filePath)}"`);return this.config}async save_(){await (0,_promises.writeFile)(this.filePath,JSON.stringify(this.config??{},null,4),"utf-8")}setItem(key,value){_lodash.default.set(this.config,key,value);return this}getItem(key,defaultValue){return _lodash.default.get(this.config,key,defaultValue)}constructor(filePath){this.filePath=filePath;this.config=undefined}}const _default=JsonConfigProvider;
//# sourceMappingURL=JsonConfigProvider.js.map