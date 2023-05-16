import path from 'node:path';
import ConfigLoader from '../lib';

const cfgDir = path.resolve(__dirname, './data');

let config = ConfigLoader.createEnvAwareJsonLoader(cfgDir, 'test', 'production');

config.load_().then(cfg => {
    console.log(cfg); 
});