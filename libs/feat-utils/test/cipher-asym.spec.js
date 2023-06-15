import { startWorker } from '@galaxar/app';

describe('cipher-asym', function () {
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

    it('should encrypt a message with the public key and decrypt with private key', async () => {
        await startWorker(
            async (app) => {
                const cipher = app.getService('cipher');
                const algorithm = 'rsa';
                const options = { modulusLength: 2048 };
                const { privateKey, publicKey } = cipher.generateKeyPair(algorithm, options);
                const message = 'hello world';
                
                const encrypted = cipher.publicEncrypt(message, publicKey);
                const result = cipher.privateDecrypt(encrypted, privateKey);
                result.should.equal(message);
            },
            {
                workingPath: 'test',
                //logLevel: "debug"
            }
        );        
      });

      it('should sign a message with the private key and verify with private key', async () => {
        await startWorker(
            async (app) => {
                const cipher = app.getService('cipher');
                const algorithm = 'rsa';
                const options = { modulusLength: 2048 };
                const { privateKey, publicKey } = cipher.generateKeyPair(algorithm, options);
                const message = 'hello world';
                
                const signature = cipher.privateSign(message, privateKey);
                const result = cipher.publicVerify(message, signature, publicKey);
                result.should.be.true();
            },
            {
                workingPath: 'test',
                //logLevel: "debug"
            }
        );        
      });

});

