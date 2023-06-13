import { Types } from "..";

describe('issues', () => {
    it('sanitize without meta failed', () => {
        Types.INTEGER.sanitize('123').should.equal(123);
    });
});