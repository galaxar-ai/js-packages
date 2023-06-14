"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _nodecrypto = /*#__PURE__*/ _interop_require_default(require("node:crypto"));
const _app = require("@galaxar/app");
const _types = require("@galaxar/types");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const _default = {
    stage: _app.Feature.SERVICE,
    groupable: true,
    load_: async function(app, options, name) {
        const { hashAlgorithm , cipherAlgorithm , key , asymmetricAlgorithm , asymmetricBits , signerAlgorithm  } = app.featureConfig(options, {
            schema: {
                key: {
                    type: 'text',
                    fixedLength: 32,
                    optional: true
                },
                hashAlgorithm: {
                    type: 'text',
                    optional: true,
                    default: 'sha256'
                },
                cipherAlgorithm: {
                    type: 'text',
                    optional: true,
                    default: 'aes-256-cbc'
                },
                asymmetricAlgorithm: {
                    type: 'enum',
                    values: [
                        'rsa',
                        'rsa-pss',
                        'dsa',
                        'ec',
                        'ed25519',
                        'ed448',
                        'x25519',
                        'x448',
                        'dh'
                    ],
                    optional: true,
                    default: 'rsa'
                },
                asymmetricBits: {
                    type: 'integer',
                    optional: true,
                    default: 2048
                },
                signerAlgorithm: {
                    type: 'text',
                    optional: true,
                    default: 'rsa-sha256'
                }
            }
        }, name);
        const service = {
            hash: (message, salt, encoding = 'hex', _hashAlgorithm)=>{
                const hash = _nodecrypto.default.createHash(_hashAlgorithm ?? hashAlgorithm);
                hash.update(message);
                hash.update(salt);
                return hash.digest(encoding);
            },
            encrypt: (message, _key, _cipherAlgorithm)=>{
                if (_key && _key.length !== 32) {
                    throw new _types.ValidationError('The length of symmetric key should be exactly 32.', {
                        key: _key
                    });
                }
                const buf = Buffer.alloc(16);
                _nodecrypto.default.randomFillSync(buf);
                const cipher = _nodecrypto.default.createCipheriv(_cipherAlgorithm ?? cipherAlgorithm, _key ?? key, buf);
                let encryptedData = cipher.update(message, 'utf-8', 'base64');
                encryptedData += cipher.final('base64');
                encryptedData += buf.toString('hex');
                return encryptedData;
            },
            decrypt: (message, _key, _cipherAlgorithm)=>{
                if (_key && _key.length !== 32) {
                    throw new _types.ValidationError('The length of symmetric key should be exactly 32.', {
                        key: _key
                    });
                }
                const l = message.length - 32;
                const iv = Buffer.from(message.substring(l), 'hex');
                const encrypted = message.substring(0, l);
                const decipher = _nodecrypto.default.createDecipheriv(_cipherAlgorithm ?? cipherAlgorithm, _key ?? key, iv);
                let decrypted = decipher.update(encrypted, 'base64', 'utf8');
                decrypted += decipher.final('utf8');
                return decrypted;
            },
            generateKeyPair: (algorithm, _options)=>{
                const keypair = _nodecrypto.default.generateKeyPairSync(algorithm ?? asymmetricAlgorithm, {
                    modulusLength: asymmetricBits,
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'pem'
                    },
                    ..._options
                });
                return keypair;
            },
            generateKeyPair_: async (algorithm, _options)=>{
                const keypair = await new Promise((resolve, reject)=>_nodecrypto.default.generateKeyPair(algorithm ?? asymmetricAlgorithm, {
                        modulusLength: asymmetricBits,
                        publicKeyEncoding: {
                            type: 'spki',
                            format: 'pem'
                        },
                        privateKeyEncoding: {
                            type: 'pkcs8',
                            format: 'pem'
                        },
                        ..._options
                    }, (err, publicKey, privateKey)=>{
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve({
                            publicKey,
                            privateKey
                        });
                    }));
                return keypair;
            },
            publicEncrypt: (message, publicKey, encoding = 'base64')=>{
                return _nodecrypto.default.publicEncrypt(publicKey, Buffer.from(message, 'utf8')).toString(encoding);
            },
            privateDecrypt: (message, privateKey, encoding = 'base64')=>{
                return _nodecrypto.default.privateDecrypt(privateKey, Buffer.from(message, encoding)).toString('utf8');
            },
            privateSign: (message, privateKey, _signerAlgorithm, encoding = 'base64')=>{
                const signer = _nodecrypto.default.createSign(_signerAlgorithm ?? signerAlgorithm);
                signer.update(message);
                return signer.sign(privateKey, encoding);
            },
            publicVerify: (message, signature, publicKey, _signerAlgorithm, encoding = 'base64')=>{
                const verifier = _nodecrypto.default.createVerify(_signerAlgorithm ?? signerAlgorithm);
                verifier.update(message);
                return verifier.verify(publicKey, signature, encoding);
            }
        };
        app.registerService(name, service);
    }
};

//# sourceMappingURL=cipher.js.map