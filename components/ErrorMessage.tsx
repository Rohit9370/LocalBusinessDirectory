import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface ErrorMessageProps {
    message: string;
    visible: boolean;
    onDismiss?: () => void;
    autoDismiss?: boolean;
    dismissTimeout?: number;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    visible,
    onDismiss,
    autoDismiss = true,
    dismissTimeout = 4000,
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-50)).current;

    useEffect(() => {
        if (visible) {
            // Slide in and fade in
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto dismiss
            if (autoDismiss && onDismiss) {
                const timer = setTimeout(() => {
                    handleDismiss();
                }, dismissTimeout);
                return () => clearTimeout(timer);
            }
        } else {
            handleDismiss();
        }
    }, [visible]);

    const handleDismiss = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: -50,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (onDismiss) {
                onDismiss();
            }
        });
    };

    if (!visible) {
        return null;
    }

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={24} color="#fff" style={styles.icon} />
                <Text style={styles.errorText}>{message}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        zIndex: 1000,
    },
    errorBox: {
        backgroundColor: '#ff4444',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    icon: {
        marginRight: 12,
    },
    errorText: {
        flex: 1,
        color: '#fff',
        fontSize: 15,
        fontFamily: 'RobotoCondensed-Medium',
        lineHeight: 20,
    },
});
