import JSV from '@galaxar/jsonv';
import { transform } from '@galaxar/jsonx';

const jsv = (value, options, meta, context) =>
    JSV.match(value, options, null, { name: context.path, jsonx: transform, locale: context.i18n?.locale });

export default {
    jsv,
};
