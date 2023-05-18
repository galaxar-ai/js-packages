"use strict";Object.defineProperty(exports,"__esModule",{value:true});Object.defineProperty(exports,"default",{enumerable:true,get:function(){return _default}});const _jsonc=_interop_require_wildcard(require("@galaxar/jsonc"));const _utils=require("@galaxar/utils");const _sys=require("@galaxar/sys");const _types=require("@galaxar/types");const _algo=require("@galaxar/algo");const _nodepath=_interop_require_default(require("node:path"));const _Feature=_interop_require_default(require("./Feature"));const _defaultOpts=_interop_require_default(require("./defaultOpts"));const _AsyncEmitter=_interop_require_default(require("./helpers/AsyncEmitter"));const _logger=require("./logger");function _define_property(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}function _interop_require_default(obj){return obj&&obj.__esModule?obj:{default:obj}}function _getRequireWildcardCache(nodeInterop){if(typeof WeakMap!=="function")return null;var cacheBabelInterop=new WeakMap;var cacheNodeInterop=new WeakMap;return(_getRequireWildcardCache=function(nodeInterop){return nodeInterop?cacheNodeInterop:cacheBabelInterop})(nodeInterop)}function _interop_require_wildcard(obj,nodeInterop){if(!nodeInterop&&obj&&obj.__esModule){return obj}if(obj===null||typeof obj!=="object"&&typeof obj!=="function"){return{default:obj}}var cache=_getRequireWildcardCache(nodeInterop);if(cache&&cache.has(obj)){return cache.get(obj)}var newObj={};var hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj){if(key!=="default"&&Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;if(desc&&(desc.get||desc.set)){Object.defineProperty(newObj,key,desc)}else{newObj[key]=obj[key]}}}newObj.default=obj;if(cache){cache.set(obj,newObj)}return newObj}const FILE_EXT=[".js",".mjs",".cjs",".ts"];const configOverrider=(defConf,envConf)=>{const{serviceGroup:defServiceGroup,..._def}=defConf??{};const{serviceGroup:envServiceGroup,..._env}=envConf??{};const serviceGroup={};if(defServiceGroup||envServiceGroup){defServiceGroup&&_utils._.each(defServiceGroup,(servicesMap,serviceName)=>{serviceGroup[serviceName]=servicesMap});envServiceGroup&&_utils._.each(envServiceGroup,(servicesMap,serviceName)=>{serviceGroup[serviceName]={...serviceGroup[serviceName],...servicesMap}})}const ret={..._def,..._env};if(!_utils._.isEmpty(serviceGroup)){ret.serviceGroup=serviceGroup}return ret};class ServiceContainer extends _AsyncEmitter.default{async start_(){this.log("verbose",`Starting app [${this.name}] ...`);await this.emit_("starting",this);this._featureRegistry={"*":this._getFeatureFallbackPath()};this.features={};this.services={};if(this.options.loadConfigFromOptions){this.config=this.options.config}else{this.configLoader=this.options.disableEnvAwareConfig?new _jsonc.default(new _jsonc.JsonConfigProvider(_nodepath.default.join(this.configPath,this.options.configName+".json")),this):_jsonc.default.createEnvAwareJsonLoader(this.configPath,this.options.configName,this.env,this,configOverrider);await this.loadConfig_()}await this.emit_("configLoaded",this.config);if(!_utils._.isEmpty(this.config)){await this._loadFeatures_()}else{this.log("verbose",`Empty configuration! Config path: ${this.configPath}`)}await this.emit_("ready",this);this.started=true;return this}async stop_(){await this.emit_("stopping",this);this.log("verbose",`Stopping app [${this.name}] ...`);this.started=false;delete this.services;delete this.features;delete this._featureRegistry;delete this.config;delete this.configLoader;await this.emit_("stopped",this);this.allOff()}async loadConfig_(){let configVariables=this._getConfigVariables();this.config=await this.configLoader.load_(configVariables);return this}toAbsolutePath(...args){if(args.length===0||args[0]==null){return this.workingPath}return _nodepath.default.resolve(this.workingPath,...args)}tryRequire(pkgName,local){const obj=local?require(pkgName):(0,_sys.tryRequire)(pkgName,this.workingPath);return(0,_utils.esmCheck)(obj)}registerService(name,serviceObject,override){if(name in this.services&&!override){throw new Error('Service "'+name+'" already registered!')}this.services[name]=serviceObject;this.log("verbose",`Service "${name}" registered.`);return this}hasService(name){return name in this.services}getService(name){return this.services[name]}enabled(feature){return this.features[feature]?.enabled??false}addFeatureRegistry(registry){if(registry.hasOwnProperty("*")){(0,_utils.pushIntoBucket)(this._featureRegistry,"*",registry["*"])}Object.assign(this._featureRegistry,_utils._.omit(registry,["*"]))}logException(level,error,summary){this.log(level,(summary?summary+"\n":"")+error.message,_utils._.pick(error,["name","status","code","info","stack","request"]));return this}featureConfig(config,typeInfo,name){this.sanitize(config,typeInfo,name,"feature")}sanitize(config,typeInfo,name,category){try{return _types.Types.sanitize(config,{type:"object",...typeInfo},undefined,name)}catch(err){throw new _types.InvalidConfiguration(err.message,this,{category,name})}}_getConfigVariables(){const processInfo={env:process.env,arch:process.arch,argv:process.argv,cwd:process.cwd(),pid:process.pid,platform:process.platform};return{app:this,env:this.env,process:processInfo}}_getFeatureFallbackPath(){return[_nodepath.default.resolve(__dirname,"features"),this.featuresPath]}_sortFeatures(features){if(features.length===0){return features}const topoSort=new _algo.TopoSort;features.forEach(([feature])=>{topoSort.depends(feature.name,feature.depends)});const groups=(0,_utils.arrayToObject)(features,([feature])=>feature.name);const keys=topoSort.sort();return keys.map(key=>groups[key])}async _loadFeatures_(){let configStageFeatures=[];_utils._.each(this.config,(featureOptions,name)=>{if(this.options.allowedFeatures&&this.options.allowedFeatures.indexOf(name)===-1){return}let feature;try{feature=this._loadFeature(name)}catch(err){}if(feature&&feature.stage===_Feature.default.CONF){configStageFeatures.push([feature,featureOptions]);delete this.config[name]}});if(configStageFeatures.length>0){await this._loadFeatureGroup_(configStageFeatures,_Feature.default.CONF);return this._loadFeatures_()}if(this.runnable&&this.config.logger==null){(0,_logger.setLogLevel)(this.options.logLevel);const logging=(0,_logger.makeLogger)(_logger.consoleLogger);this.logger={log:logging};this.log=logging;this._logCache.forEach(log=>this.logger.log(...log));this._logCache.length=0}await this.emit_("configFinalized",this.config);let featureGroups={[_Feature.default.INIT]:[],[_Feature.default.SERVICE]:[],[_Feature.default.PLUGIN]:[],[_Feature.default.FINAL]:[]};_utils._.each(this.config,(featureOptions,name)=>{if(this.options.allowedFeatures&&this.options.allowedFeatures.indexOf(name)===-1){return}let feature=this._loadFeature(name);if(!(feature.stage in featureGroups)){throw new Error(`Invalid feature type. Feature: ${name}, type: ${feature.stage}`)}featureGroups[feature.stage].push([feature,featureOptions])});return(0,_utils.eachAsync_)(featureGroups,(group,stage)=>this._loadFeatureGroup_(group,stage))}async _loadFeatureGroup_(featureGroup,groupStage){featureGroup=this._sortFeatures(featureGroup);await this.emit_("before:"+groupStage);this.log("verbose",`Loading "${groupStage}" feature group ...`);await (0,_utils.eachAsync_)(featureGroup,async([feature,options])=>{const{name,depends}=feature;await this.emit_("before:load:"+name);this.log("verbose",`Loading feature "${name}" ...`);depends&&this._dependsOn(depends,name);await feature.load_(this,options,name);this.features[name].enabled=true;-this.log("verbose",`Feature "${name}" loaded. [OK]`);await this.emit_("after:load:"+name)});this.log("verbose",`Finished loading "${groupStage}" feature group. [OK]`);await this.emit_("after:"+groupStage)}_dependsOn(features,fromFeature){let hasNotEnabled=_utils._.find(_utils._.castArray(features),feature=>!this.enabled(feature));if(hasNotEnabled){throw new Error(`The "${hasNotEnabled}" feature depended by "${fromFeature}" feature is not enabled.`)}}_loadFeature(feature){let featureObject=this.features[feature];if(featureObject)return featureObject;let featurePath;if(this._featureRegistry.hasOwnProperty(feature)){let loadOption=this._featureRegistry[feature];if(Array.isArray(loadOption)){if(loadOption.length===0){throw new Error(`Invalid registry value for feature "${feature}".`)}featurePath=loadOption[0];featureObject=this.tryRequire(featurePath,true);if(loadOption.length>1){featureObject=_utils._.get(featureObject,loadOption[1])}}else{featurePath=loadOption;featureObject=this.tryRequire(featurePath,true)}}else{let searchingPath=this._featureRegistry["*"];let found=_utils._.findLast(searchingPath,p=>FILE_EXT.find(ext=>{featurePath=_nodepath.default.join(p,feature+ext);return _sys.fs.existsSync(featurePath)}));if(!found){throw new _types.InvalidConfiguration(`Don't know where to load feature "${feature}".`,this,{feature,searchingPath})}featureObject=this.tryRequire(featurePath,true)}if(!_Feature.default.validate(featureObject)){throw new Error(`Invalid feature object loaded from "${featurePath}".`)}featureObject=typeof featureObject==="function"?featureObject(this):featureObject;featureObject.name=feature;this.features[feature]=featureObject;return featureObject}constructor(name,options){super();_define_property(this,"logError",(error,message)=>{return this.logException("error",error,message)});_define_property(this,"logErrorAsWarning",(error,message)=>{return this.logException("warn",error,message)});this.name=name;this.options={..._defaultOpts.default,...options};this.env=this.options.env;this.workingPath=this.options.workingPath?_nodepath.default.resolve(this.options.workingPath):process.cwd();this.configPath=this.toAbsolutePath(this.options.configPath);this.featuresPath=this.toAbsolutePath(this.options.featuresPath);this._logCache=[];this.log=(...args)=>{this._logCache.push(args);return this}}}const _default=ServiceContainer;
//# sourceMappingURL=ServiceContainer.js.map