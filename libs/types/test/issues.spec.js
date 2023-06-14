import { Types } from "../lib";

describe('issues', () => {
    it('sanitize without meta failed', () => {
        Types.INTEGER.sanitize('123').should.equal(123);
    });
});