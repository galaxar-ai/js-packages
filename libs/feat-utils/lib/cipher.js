import crypto from 'node:crypto';
import { Feature } from '@galaxar/app';

export default {
    stage: Feature.SERVICE,

    groupable: true,

    load_: async function (app, options, name) {
        options = app.featureConfig(options, {
            schema: {
                key: { type: 'text' },
            },
            keepUnsanitized: true,
        }, name);

        const { hashAlgorithm, cipherAlgorithm, key } = {
            hashAlgorithm: 'sha256',
            cipherAlgorithm: 'aes-256-cbc',
            ...options,
        };

        const service = {
            hash: (message, salt, encoding = 'hex', _hashAlgorithm) => {
                const hash = crypto.createHash(_hashAlgorithm ?? hashAlgorithm);
                hash.update(message);
                hash.update(salt);

                return hash.digest(encoding);
            },

            encrypt: (message) => {
                const buf = Buffer.alloc(16);
                crypto.randomFillSync(buf);

                const cipher = crypto.createCipheriv(cipherAlgorithm, key, buf);

                let encryptedData = cipher.update(message, 'utf-8', 'base64');
                encryptedData += cipher.final('base64');
                encryptedData += buf.toString('hex');
                return encryptedData;
            },

            decrypt: (message) => {
                const l = message.length - 32;
                const iv = Buffer.from(message.substring(l), 'hex');

                const encrypted = message.substring(0, l);

                const decipher = crypto.createDecipheriv(cipherAlgorithm, key, iv);
                let decrypted = decipher.update(encrypted, 'base64', 'utf8');
                decrypted += decipher.final('utf8');
                return decrypted;
            },
        };

        app.registerService(name, service);
    },
};
