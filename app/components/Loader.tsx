import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Easing, View } from 'react-native';

interface LoaderProps {
    size?: number;
    borderWidth?: number;
    primaryColor?: string;
    secondaryColor?: string;
}

export default function Loader({
    size = 20,
    borderWidth = 5,
    primaryColor = '#690569',
    secondaryColor = '#e1b8fc',
}: LoaderProps) {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const spinAnimation = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: false,
            })
        );

        spinAnimation.start();

        return () => {
            spinAnimation.stop();
        };
    }, [spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.loaderContainer}>
            <Animated.View
                style={[
                    styles.loader,
                    {
                        width: size,
                        height: size,
                        borderWidth: borderWidth,
                        borderColor: secondaryColor,
                        borderTopColor: primaryColor,
                        transform: [{ rotate: spin }],
                    },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    loaderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    loader: {
        borderRadius: 50,
    },
});