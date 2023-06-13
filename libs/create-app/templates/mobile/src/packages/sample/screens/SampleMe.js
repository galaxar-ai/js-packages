import React from 'react';
import { StyleSheet, Image, Text } from 'react-native';
import { Block } from 'galio-framework';
import logoImage from '@genx/react/assets/logo.png';

const Sample = () => {
    return (
        <Block flex>
            <Block style={styles.logoBlock} row center>
                <Image
                    style={styles.logo}
                    resizeMode="contain"
                    source={logoImage}
                />
            </Block>
            <Block center>
                <Text style={styles.title}>@genx/react</Text>
                <Text style={styles.text}>
                    Gen-X React Library (React & React Native) {'\n'}
                </Text>
                <Text style={styles.text}>MIT License</Text>
                <Text style={styles.text}>
                    Copyright (c) 2020 GEN-X TECH PTY LTD
                </Text>
            </Block>
        </Block>
    );
};

const styles = StyleSheet.create({
    logoBlock: {
        maxHeight: 350,
    },
    logo: {
        width: '60%',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    text: {
        fontSize: 16,
        marginVertical: 2,
    },
});

export default Sample;
