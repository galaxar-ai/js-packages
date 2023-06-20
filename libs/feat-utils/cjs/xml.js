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
const _app = require("@galaxar/app");
const _default = {
    stage: _app.Feature.SERVICE,
    groupable: true,
    load_: async function(app, options, name) {
        const { parser: parserOptions , builder: builderOptions  } = options;
        const { XMLParser , XMLBuilder  } = app.tryRequire('fast-xml-parser');
        const service = {
            parse: (xml)=>{
                const parser = new XMLParser(parserOptions);
                return parser.parse(xml);
            },
            build: (obj)=>{
                const builder = new XMLBuilder(builderOptions);
                return builder.build(obj);
            }
        };
        app.registerService(name, service);
    }
};

//# sourceMappingURL=xml.js.map