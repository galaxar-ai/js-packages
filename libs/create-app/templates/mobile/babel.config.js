module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./src'],
            },
        ],
        //export * as ns from 'mod';
        '@babel/plugin-proposal-export-namespace-from',
        'module:react-native-dotenv',
    ],
};
