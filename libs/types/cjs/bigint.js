"use strict";
const reviver = (key, value)=>key === "big" ? BigInt(value) : value;
BigInt.prototype.toJSON = function() {
    return this.toString();
};
