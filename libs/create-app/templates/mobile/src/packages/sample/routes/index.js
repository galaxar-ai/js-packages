import SampleMe from '../screens/SampleMe';

export default {
    type: 'stack',
    initialRouteName: 'MeHome',
    screenOptions: {
        headerShown: false,
    },
    screens: [
        {
            name: 'MeHome',
            component: SampleMe,
            options: {},
        },
    ],
};
