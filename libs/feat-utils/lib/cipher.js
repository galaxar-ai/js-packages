import crypto from 'node:crypto';
import { createReadStream } from 'node:fs';
import { Feature } from '@galaxar/app';
import { ValidationError } from '@galaxar/types';

const hashes = [
    'rsa-md5',
    'rsa-ripemd160',
    'rsa-sha1',
    'rsa-sha1-2',
    'rsa-sha224',
    'rsa-sha256',
    'rsa-sha3-224',
    'rsa-sha3-256',
    'rsa-sha3-384',
    'rsa-sha3-512',
    'rsa-sha384',
    'rsa-sha512',
    'rsa-sha512/224',
    'rsa-sha512/256',
    'rsa-sm3',
    'blake2b512',
    'blake2s256',
    'id-rsassa-pkcs1-v1_5-with-sha3-224',
    'id-rsassa-pkcs1-v1_5-with-sha3-256',
    'id-rsassa-pkcs1-v1_5-with-sha3-384',
    'id-rsassa-pkcs1-v1_5-with-sha3-512',
    'md5',
    'md5-sha1',
    'md5withrsaencryption',
    'ripemd',
    'ripemd160',
    'ripemd160withrsa',
    'rmd160',
    'sha1',
    'sha1withrsaencryption',
    'sha224',
    'sha224withrsaencryption',
    'sha256',
    'sha256withrsaencryption',
    'sha3-224',
    'sha3-256',
    'sha3-384',
    'sha3-512',
    'sha384',
    'sha384withrsaencryption',
    'sha512',
    'sha512-224',
    'sha512-224withrsaencryption',
    'sha512-256',
    'sha512-256withrsaencryption',
    'sha512withrsaencryption',
    'shake128',
    'shake256',
    'sm3',
    'sm3withrsaencryption',
    'ssl3-md5',
    'ssl3-sha1',
];

export default {
    stage: Feature.SERVICE,

    groupable: true,

    load_: async function (app, options, name) {
        const { hashAlgorithm, cipherAlgorithm, key, asymmetricAlgorithm, asymmetricBits, signerAlgorithm } =
            app.featureConfig(
                options,
                {
                    schema: {
                        key: { type: 'text', fixedLength: 32, optional: true },
                        hashAlgorithm: { type: 'text', enum: hashes, optional: true, default: 'sha256' },
                        cipherAlgorithm: { type: 'text', optional: true, default: 'aes-256-cbc' },
                        asymmetricAlgorithm: {
                            type: 'text',
                            enum: ['rsa', 'rsa-pss', 'dsa', 'ec', 'ed25519', 'ed448', 'x25519', 'x448', 'dh'],
                            optional: true,
                            default: 'rsa',
                        },
                        asymmetricBits: { type: 'integer', optional: true, default: 2048 },
                        signerAlgorithm: { type: 'text', enum: hashes, optional: true, default: 'rsa-sha256' },
                    },
                },
                name
            );

        const service = {
            hash: (message, salt, encoding = 'hex', _hashAlgorithm) => {
                const hash = crypto.createHash(_hashAlgorithm ?? hashAlgorithm);
                hash.update(message);
                hash.update(salt);

                return hash.digest(encoding);
            },

            hashFile_: async (filePath, encoding = 'hex', _hashAlgorithm) => {
                const hash = crypto.createHash(_hashAlgorithm ?? hashAlgorithm);
                return new Promise((resolve, reject) =>
                    createReadStream(filePath)
                        .on('error', reject)
                        .pipe(hash)
                        .on('error', reject)
                        .on('finish', () => {
                            if (encoding === 'buffer') {
                                const { buffer } = new Uint8Array(hash.read());
                                resolve(buffer);
                            } else {
                                resolve(hash.read().toString(encoding));
                            }
                        })
                );
            },

            encrypt: (message, _key, _cipherAlgorithm) => {
                if (_key && _key.length !== 32) {
                    throw new ValidationError('The length of symmetric key should be exactly 32.', {
                        key: _key,
                    });
                }

                const buf = Buffer.alloc(16);
                crypto.randomFillSync(buf);

                const cipher = crypto.createCipheriv(_cipherAlgorithm ?? cipherAlgorithm, _key ?? key, buf);

                let encryptedData = cipher.update(message, 'utf-8', 'base64');
                encryptedData += cipher.final('base64');
                encryptedData += buf.toString('hex');
                return encryptedData;
            },

            decrypt: (message, _key, _cipherAlgorithm) => {
                if (_key && _key.length !== 32) {
                    throw new ValidationError('The length of symmetric key should be exactly 32.', {
                        key: _key,
                    });
                }

                const l = message.length - 32;
                const iv = Buffer.from(message.substring(l), 'hex');

                const encrypted = message.substring(0, l);

                const decipher = crypto.createDecipheriv(_cipherAlgorithm ?? cipherAlgorithm, _key ?? key, iv);
                let decrypted = decipher.update(encrypted, 'base64', 'utf8');
                decrypted += decipher.final('utf8');
                return decrypted;
            },

            generateKeyPair: (algorithm, _options) => {
                const keypair = crypto.generateKeyPairSync(algorithm ?? asymmetricAlgorithm, {
                    modulusLength: asymmetricBits,
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem',
                    },
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'pem',
                    },
                    ..._options,
                });

                return keypair;
            },

            generateKeyPair_: async (algorithm, _options) => {
                const keypair = await new Promise((resolve, reject) =>
                    crypto.generateKeyPair(
                        algorithm ?? asymmetricAlgorithm,
                        {
                            modulusLength: asymmetricBits,
                            publicKeyEncoding: {
                                type: 'spki',
                                format: 'pem',
                            },
                            privateKeyEncoding: {
                                type: 'pkcs8',
                                format: 'pem',
                            },
                            ..._options,
                        },
                        (err, publicKey, privateKey) => {
                            if (err) {
                                reject(err);
                                return;
                            }

                            resolve({ publicKey, privateKey });
                        }
                    )
                );

                return keypair;
            },

            publicEncrypt: (message, publicKey, encoding = 'base64') => {
                return crypto.publicEncrypt(publicKey, Buffer.from(message, 'utf8')).toString(encoding);
            },

            privateDecrypt: (message, privateKey, encoding = 'base64') => {
                return crypto.privateDecrypt(privateKey, Buffer.from(message, encoding)).toString('utf8');
            },

            privateSign: (message, privateKey, _signerAlgorithm, encoding = 'base64') => {
                const signer = crypto.createSign(_signerAlgorithm ?? signerAlgorithm);
                signer.update(message);

                return signer.sign(privateKey, encoding);
            },

            publicVerify: (message, signature, publicKey, _signerAlgorithm, encoding = 'base64') => {
                const verifier = crypto.createVerify(_signerAlgorithm ?? signerAlgorithm);
                verifier.update(message);

                return verifier.verify(publicKey, signature, encoding);
            },
        };

        app.registerService(name, service);
    },
};
