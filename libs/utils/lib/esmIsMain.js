import url from 'node:url';

function esmIsMain() {
    if (import.meta.url.startsWith('file:')) {
        // (A)
        const modulePath = url.fileURLToPath(import.meta.url);
        if (process.argv[1] === modulePath) {
            // (B)
            return true;
        }
    }

    return false;
}

export default esmIsMain;