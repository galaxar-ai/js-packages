"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    isPlainObject: function() {
        return _isPlainObject.default;
    },
    remap: function() {
        return _remap.default;
    },
    diff: function() {
        return _diff.default;
    },
    take: function() {
        return _take.default;
    },
    pushIntoBucket: function() {
        return _pushIntoBucket.default;
    },
    get: function() {
        return _get.default;
    },
    set: function() {
        return _set.default;
    },
    cowSet: function() {
        return _cowSet.default;
    },
    objectToArray: function() {
        return _objectToArray.default;
    },
    flattenObject: function() {
        return _flattenObject.default;
    },
    unflattenObject: function() {
        return _unflattenObject.default;
    },
    filterNull: function() {
        return _filterNull.default;
    },
    xNull: function() {
        return _filterNull.default;
    },
    defaultDeep: function() {
        return _defaultDeep.default;
    }
});
var _isPlainObject = /*#__PURE__*/ _interop_require_default(require("./isPlainObject"));
var _remap = /*#__PURE__*/ _interop_require_default(require("./remap"));
var _diff = /*#__PURE__*/ _interop_require_default(require("./diff"));
var _take = /*#__PURE__*/ _interop_require_default(require("./take"));
var _pushIntoBucket = /*#__PURE__*/ _interop_require_default(require("./pushIntoBucket"));
var _get = /*#__PURE__*/ _interop_require_default(require("./get"));
var _set = /*#__PURE__*/ _interop_require_default(require("./set"));
var _cowSet = /*#__PURE__*/ _interop_require_default(require("./cowSet"));
var _objectToArray = /*#__PURE__*/ _interop_require_default(require("./objectToArray"));
var _flattenObject = /*#__PURE__*/ _interop_require_default(require("./flattenObject"));
var _unflattenObject = /*#__PURE__*/ _interop_require_default(require("./unflattenObject"));
var _filterNull = /*#__PURE__*/ _interop_require_default(require("./filterNull"));
var _defaultDeep = /*#__PURE__*/ _interop_require_default(require("./defaultDeep"));
_export_star(require("./pathUtils"), exports);
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
