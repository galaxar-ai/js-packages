const shouldThrow_ = async (fn, error) => {
    try {
        await fn();
        should.not.exist('here');
    } catch (e) {
        should.throws(() => {
            throw e;
        }, error);
    }
};

export default shouldThrow_;
