import path from 'node:path';
import { startWorker } from '@galaxar/app';
import { fs } from '@galaxar/sys';
import { publicVerify } from '../lib/utils/crypto';
import { X509Certificate } from 'node:crypto';

const imageFile = path.resolve(__dirname, './files/logo.png');

describe('hasher', function () {
    it('test case 1', async function () {
        await startWorker(
            async (app) => {
                const hasher = app.getService('cipher');
                should.exist(hasher);

                const hash = await hasher.hashFile_(imageFile, 'hex', 'md5');
                hash.should.be.exactly('3349b8205d8c682a3d246d8b0d07635f');
            },
            {
                workingPath: 'test',
                //logLevel: "debug"
            }
        );
    });

    it('test case 1', async function () {
        const body = {
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
        };
        const payload = Buffer.from(JSON.stringify(body)).toString('ascii');

        const cer = await fs.readFile(path.resolve(__dirname, './files/public.cer'));
        const x509 = new X509Certificate(cer);

        const verify = publicVerify(
            'sha256',
            x509.publicKey,
            payload,
            'dD/9pxvVYvzKKHcdUHfEaatT0XvGLXLPePMEcXCGcSlRhiN3Z7e/UpoCgHMExYhKL851UFXpVSnjTS+oI0KFIXsEL6cXBrvGTd6fZSJOj8AlQ1pc+8sjMSGVQJMxvW5vR85PF5n1Tit4QvAMLH7jBD3a4BeADGt8SLRFHCsCaToo/M/ztTJEJE0dZvVVjGJ29pLE0SJftPRu9jtE+ex26C20h+eNn83ozAdrmPFpw7+6oxNpo0gnEPDMO/Ze4LffnXpZOslfAjDsMrIIKeOHU1Lws/zah/qtNGziIyL88kZR+ixC5TCK8j6Gk6NTNPDaC/271O5/rFy++KRuUFMeeA=='
        );

        console.log(verify);
    });
});
