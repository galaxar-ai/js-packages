import { startWorker } from '@galaxar/app';

describe.only('cipher-asym', function () {
    it('should generate a key pair with the default algorithm and options', async () => {
        await startWorker(
            async (app) => {
                const cipher = app.getService('cipher');

                const result = cipher.generateKeyPair();
                result.should.have.properties(['publicKey', 'privateKey']);
                result.publicKey.should.startWith('-----BEGIN PUBLIC KEY-----');
                result.privateKey.should.startWith('-----BEGIN PRIVATE KEY-----');
            },
            {
                workingPath: 'test',
                //logLevel: "debug"
            }
        );
    });

    it('should generate a key pair with the specified algorithm and options', async () => {
        await startWorker(
            async (app) => {
                const cipher = app.getService('cipher');
                const algorithm = 'rsa';
                const options = { modulusLength: 2048 };
                const result = cipher.generateKeyPair(algorithm, options);
                result.should.have.properties(['publicKey', 'privateKey']);
                result.publicKey.should.startWith('-----BEGIN PUBLIC KEY-----');
                result.privateKey.should.startWith('-----BEGIN PRIVATE KEY-----');
            },
            {
                workingPath: 'test',
                //logLevel: "debug"
            }
        );
    });

    it('should generate a key pair asynchronously', async () => {
        await startWorker(
            async (app) => {
                const cipher = app.getService('cipher');
                const result = await cipher.generateKeyPair_();
                result.should.have.properties(['publicKey', 'privateKey']);
                result.publicKey.should.startWith('-----BEGIN PUBLIC KEY-----');
                result.privateKey.should.startWith('-----BEGIN PRIVATE KEY-----');
            },
            {
                workingPath: 'test',
                //logLevel: "debug"
            }
        );
    });

    it('should generate a key pair with the specified algorithm and options asynchronously', async () => {
        await startWorker(
            async (app) => {
                const cipher = app.getService('cipher');
                const algorithm = 'rsa';
                const options = { modulusLength: 2048 };
                const result = await cipher.generateKeyPair_(algorithm, options);
                result.should.have.properties(['publicKey', 'privateKey']);
                result.publicKey.should.startWith('-----BEGIN PUBLIC KEY-----');
                result.privateKey.should.startWith('-----BEGIN PRIVATE KEY-----');
            },
            {
                workingPath: 'test',
                //logLevel: "debug"
            }
        );
    });
});

/*

describe('publicEncrypt', () => {
  it('should encrypt a message with the public key', () => {
    const message = 'hello world';
    const keypair = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
    const result = cipher.publicEncrypt(message, keypair.publicKey);
    result.should.not.equal(message);
  });
});

describe('privateDecrypt', () => {
  it('should decrypt a message with the private key', () => {
    const message = 'hello world';
    const keypair = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
    const encrypted = cipher.publicEncrypt(message, keypair.publicKey);
    const result = cipher.privateDecrypt(encrypted, keypair.privateKey);
    result.should.equal(message);
  });
});

describe('privateSign', () => {
  it('should sign a message with the private key', () => {
    const message = 'hello world';
    const keypair = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
    const result = cipher.privateSign(message, keypair.privateKey);
    result.should.not.equal(message);
  });
});

describe('publicVerify', () => {
  it('should verify a message signature with the public key', () => {
    const message = 'hello world';
    const keypair = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
    const signature = cipher.privateSign(message, keypair.privateKey);
    const result = cipher.publicVerify(message, signature, keypair.publicKey);
    result.should.be.true();
  });
});
*/
