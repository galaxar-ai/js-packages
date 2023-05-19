import dbgGetCallerFile from '../dbgGetCallerFile';

function mockFn() {
    const file = dbgGetCallerFile();

    return file;
}

export default mockFn;
