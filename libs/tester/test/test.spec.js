describe('test1', function () {
    it('should pass1', function () {
        expect(true).to.be.true;
    });

    it('should pass2', function () {
        expect(true).to.be.true;
    });

    it('should pass async', async function () {
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(true).to.be.true;
    });
});
