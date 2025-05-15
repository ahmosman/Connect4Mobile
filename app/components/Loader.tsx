import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface LoaderProps {
    size?: number | 'small' | 'large';
    primaryColor?: string;
}

export default function Loader({
    size = 'small',
    primaryColor = '#690569',
}: LoaderProps) {
    return (
        <View style={styles.loaderContainer}>
            <ActivityIndicator size={size} color={primaryColor} />
        </View>
    );
}

const styles = StyleSheet.create({
    loaderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
});