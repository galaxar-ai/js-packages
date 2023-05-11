//Query & aggregate operators (pure)
const SIZE = 'Size Of';
const SUM = 'Sum Of';
const GET_TYPE = 'Type Of';
const MATCH = 'Validate';
const GET_BY_INDEX = 'Get Value By Index';
const GET_BY_KEY = 'Get Value By Key';
const FIND = 'Get Index Or Key Of';
const IF = 'If Else';

//Type casting operators (pure)
const CAST_ARRAY = 'Cast To Array';

//Math operators (pure)
const ADD = 'Add';
const SUB = 'Subtract';
const MUL = 'Multiply';
const DIV = 'Divide';
const MOD = 'Remainder';

//Collection operators (pure)
const KEYS = 'Keys Of';
const VALUES = 'Values Of';
const ENTRIES = 'Entries Of';
const OBJ_TO_ARRAY = 'Object To Array'; // like $objectToArray of mongodb
const FILTER_NULL = 'Filter Null Values';
const PICK = 'Pick By'; // filter by key
const OMIT = 'Omit By';
const SLICE = 'Slice'; // limit offset, count
const GROUP = 'Group By';
const SORT = 'Order By';
const REVERSE = 'Reverse';
const JOIN = 'Join';
const MERGE = 'Merge';
const FILTER = 'Filter By'; // filter by value
const REMAP = 'Map Keys'; // map a key to another name
const TO_JSON = 'JSON Stringfy';
const TO_OBJ = 'JSON Parse';

//Value updater (pure, copy on write)
const SET = 'Set Value';
const ADD_ITEM = 'Add K-V Entry';
const ASSIGN = 'Assign';
const APPLY = 'Apply Transformation';

const SPLIT = 'Split';
const INTERPOLATE = 'Interpolate';

//Colllection modifier
const MAP = 'Map';
const REDUCE = 'Reduce';

export default {
    SIZE,
    SUM,
    GET_TYPE,
    MATCH,
    GET_BY_INDEX,
    GET_BY_KEY,
    FIND,
    IF,

    CAST_ARRAY,

    ADD,
    SUB,
    MUL,
    DIV,
    MOD,

    KEYS,
    VALUES,
    ENTRIES,
    OBJ_TO_ARRAY,
    FILTER_NULL,
    PICK, // filter by key
    OMIT,
    SLICE,
    GROUP,
    SORT,
    REVERSE,
    JOIN,
    MERGE,
    FILTER, // filter by value
    REMAP, // map a key to another name
    TO_JSON,
    TO_OBJ,

    SET,
    ADD_ITEM,
    ASSIGN,
    APPLY,

    SPLIT,
    INTERPOLATE,

    MAP,
    REDUCE,
};
