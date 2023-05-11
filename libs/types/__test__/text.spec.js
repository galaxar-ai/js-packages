import { Types } from "..";

const { text } = Types;

describe("text", () => {
    it("should have the correct name", () => {
        text.name.should.equal("text");
    });

    it("should have the correct alias", () => {
        text.alias.should.eql(["string"]);
    });

    it("should have the correct default value", () => {
        text.defaultValue.should.equal("");
    });

    describe("sanitize", () => {
        it("should return null for null input", () => {
            const result = text.sanitize(null, {}, {}, "");
            should.equal(result, null);
        });

        it("should return the input value for rawValue input", () => {
            const value = "foo";
            const result = text.sanitize(value, { rawValue: true }, {}, "");
            result.should.equal(value);
        });

        it("should return the input value for non-empty string input", () => {
            const value = "foo";
            const result = text.sanitize(value, {}, {}, "");
            result.should.equal(value);
        });

        it("should return null for empty string input with meta.emptyAsNull", () => {
            const value = "";
            const result = text.sanitize(value, { emptyAsNull: true }, {}, "");
            should.equal(result, null);
        });

        it("should throw a ValidationError for non-string input", () => {
            const value = 123;
            (() => text.sanitize(value, {}, {}, "")).should.throw('Invalid text value.');
        });
    });
});