import { Types } from "..";

const { number } = Types;

describe("number", () => {
    it("should have the correct name", () => {
        number.name.should.equal("number");
    });

    it("should have the correct alias", () => {
        number.alias.should.eql(["float", "double"]);
    });

    it("should have the correct default value", () => {
        number.defaultValue.should.equal(0);
    });

    describe("sanitize", () => {
        it("should return null for null input", () => {
            const result = number.sanitize(null, {}, {}, "");
            should.equal(result, null);
        });

        it("should return the input value for rawValue input", () => {
            const value = 123.45;
            const result = number.sanitize(value, { rawValue: true }, {}, "");
            result.should.equal(value);
        });

        it("should return the float value for float input", () => {
            const value = 123.45;
            const result = number.sanitize(value, {}, {}, "");
            result.should.equal(value);
        });

        it("should return the float value for integer input", () => {
            const value = 123;
            const result = number.sanitize(value, {}, {}, "");
            result.should.equal(value);
        });

        it("should return the float value for string input", () => {
            const value = "123.45";
            const result = number.sanitize(value, {}, {}, "");
            result.should.equal(123.45);
        });

        it("should throw a ValidationError for invalid string input", () => {
            const value = "invalid number";
            (() => number.sanitize(value, {}, {}, "")).should.throw('Invalid number value.');
        });

        it("should throw a ValidationError for invalid input", () => {
            const value = {};
            (() => number.sanitize(value, {}, {}, "")).should.throw('Invalid number value.');
        });
    });
});