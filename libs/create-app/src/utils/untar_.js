import tar from 'tar';

const untar_ = async (file, outputDir) => {
    return tar.x(
        // or tar.extract(
        {
            file,
            strip: 1,
            cwd: outputDir,
        }
    );
};

export default untar_;
