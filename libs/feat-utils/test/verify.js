import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const testCases = [
    {
        body: {
            TransactionId: 'N00400252642',
            DateTime: '26/05/2023 1:53:11 AM',
            RemitterName: '12121212',
            Amount: '100.0000',
            AccountName: 'Wei',
            AccountNumber: '319306151',
            Bsb: '802-985',
            PaymentDescription: '',
            PayId: null,
            PayIdName: null,
            SourceBsb: '802-985',
            SourceAccountNumber: '319306151',
            SourceAccountName: '12121212',
            EndToEndId: 'TEST_NPP_RAP_MTP',
            CategoryPurposeCode: '',
            CreditorReferenceInformation: null,
            USINumber: null,
            USICreditorScheme: null,
            UltimateCreditorName: null,
        },
        signature:
            'dD/9pxvVYvzKKHcdUHfEaatT0XvGLXLPePMEcXCGcSlRhiN3Z7e/UpoCgHMExYhKL851UFXpVSnjTS+oI0KFIXsEL6cXBrvGTd6fZSJOj8AlQ1pc+8sjMSGVQJMxvW5vR85PF5n1Tit4QvAMLH7jBD3a4BeADGt8SLRFHCsCaToo/M/ztTJEJE0dZvVVjGJ29pLE0SJftPRu9jtE+ex26C20h+eNn83ozAdrmPFpw7+6oxNpo0gnEPDMO/Ze4LffnXpZOslfAjDsMrIIKeOHU1Lws/zah/qtNGziIyL88kZR+ixC5TCK8j6Gk6NTNPDaC/271O5/rFy++KRuUFMeeA==',
    },
];

async function test() {
    for (let i = 0; i < testCases.length; i++) {
        const { body, signature } = testCases[i];
        const payload = Buffer.from(JSON.stringify(body)).toString('ascii');

        const cer = await fs.readFile(path.resolve(__dirname, './files/public.cer'));
        const x509 = new crypto.X509Certificate(cer);

        const verifier = crypto.createVerify('sha256');
        verifier.update(payload);

        const verify = verifier.verify(x509.publicKey, signature, 'base64');

        console.log('case', i + 1, verify);
    }
}

test();
