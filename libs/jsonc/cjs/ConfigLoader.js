"use strict";Object.defineProperty(exports,"__esModule",{value:true});Object.defineProperty(exports,"default",{enumerable:true,get:function(){return _default}});const _lodash=_interop_require_default(require("lodash"));const _JsonConfigProvider=_interop_require_default(require("./JsonConfigProvider.js"));const _EnvAwareConfigProviderF=_interop_require_default(require("./EnvAwareConfigProviderF.js"));const _defaultSyntax=_interop_require_default(require("./defaultSyntax"));function _interop_require_default(obj){return obj&&obj.__esModule?obj:{default:obj}}const EnvAwareJsonConfigProvider=(0,_EnvAwareConfigProviderF.default)(".json",_JsonConfigProvider.default);class ConfigLoader{static createEnvAwareJsonLoader(configDir,baseName,envFlag,logger,overrider,postProcessors){return new ConfigLoader(new EnvAwareJsonConfigProvider(configDir,baseName,envFlag,overrider),logger,postProcessors)}async load_(variables){const oldData=this.data;await this.reload_(variables);if(oldData){this.data=_lodash.default.defaults(this.data,oldData)}return this.data}async reload_(variables){this.data=await this.provider.load_(this.logger,true);if(this.autoPostProcess)this.postProcess(variables);return this.data}postProcess(variables){const queue=[this.data];this._l=this.postProcessors.prefix.length;variables={...variables,$this:this.data};const interpolateElement=(coll,key,val)=>{if(typeof val==="string"){coll[key]=this._tryProcessStringValue(val,variables)}else if(_lodash.default.isPlainObject(val)||_lodash.default.isArray(val)){queue.push(val)}};let offset=0;while(queue.length>offset){const node=queue[offset];if(_lodash.default.isPlainObject(node)){_lodash.default.forOwn(node,(value,key)=>{interpolateElement(node,key,value)})}else{const l=node.length;for(let i=0;i<l;i++){interpolateElement(node,i,node[i])}}offset++}}_tryProcessStringValue(strVal,variables){if(strVal.startsWith(this.postProcessors.prefix)){const colonPos=strVal.indexOf(":");if(colonPos>this._l){const token=strVal.substring(this._l,colonPos);const operator=this.postProcessors.processors[token];if(operator){return operator(strVal.substr(colonPos+1),variables)}throw new Error("Unsupported post processor: "+token)}throw new Error("Invalid post processor syntax: "+strVal)}return strVal}constructor(configProvider,logger,postProcessors){this.provider=configProvider;this.data=undefined;this.autoPostProcess=true;this.logger=logger;this.postProcessors=postProcessors!=null?_lodash.default.defaultsDeep(postProcessors,_defaultSyntax.default):_defaultSyntax.default}}const _default=ConfigLoader;
//# sourceMappingURL=ConfigLoader.js.map