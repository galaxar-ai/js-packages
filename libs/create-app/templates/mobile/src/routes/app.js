import React from 'react';
import SampleScreen from 'screens/sample/SampleScreen';
import MeStack from 'packages/sample';
import { Icon } from '@genx/react';

export default {
    initialRouteName: 'Main',
    screens: [
        {
            name: 'Main',
            nested: 'bottomTab',
            options: {
                headerShown: false,
            },
            nestedOptions: {
                initialRouteName: 'Home',
                screenOptions: {
                    tabBarLabelStyle: {
                        fontWeight: 'bold',
                    },
                    tabBarStyle: {
                        height: 88,
                        paddingTop: 4,
                    },
                },
                screens: [
                    {
                        name: 'Home',
                        options: {
                            title: 'Home',
                            tabBarIcon: ({ focused, color, size }) => (
                                <Icon
                                    type="ionicon"
                                    name="logo-react"
                                    size={size}
                                    color={color}
                                />
                            ),
                        },
                        component: SampleScreen,
                    },
                    {
                        name: 'Me',
                        options: {
                            title: 'Me',
                            tabBarIcon: ({ focused, color, size }) => (
                                <Icon
                                    type="ionicon"
                                    name={focused ? 'person' : 'person-outline'}
                                    size={size}
                                    color={color}
                                />
                            ),
                        },
                        component: MeStack,
                    },
                ],
            },
        },
    ],
};
