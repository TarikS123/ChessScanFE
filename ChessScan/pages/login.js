import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        const loginDetails = {
            username,
            password
        };

        fetch('https://44dd-77-238-198-52.ngrok-free.app/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginDetails)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    Alert.alert('Success', data.message);
                    
                    const userData = {
                        username: username,
                        id: data.id,
                    };
                    storeUserData(userData);
                    navigation.navigate('Home'); 
                } else {
                    throw new Error(data.error || 'Login failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Alert.alert('Error', error.message || 'Failed to login. Please try again later.');
            });
    };

    const storeUserData = async (userData) => {
        try {
            const jsonValue = JSON.stringify(userData);
            await AsyncStorage.setItem('user', jsonValue);
        } catch (e) {
            console.error("Failed to save user data", e);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 70,
    },
    input: {
        width: '80%',
        height: 50,
        marginVertical: 10,
        borderWidth: 1,
        padding: 10,
        borderColor: '#ddd',
        borderWidth: 2,
        borderRadius: 10,
    },
    button: {
        backgroundColor: 'rgb(96, 219, 132)',
        padding: 10,
        width: '80%',
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 10,

    },
    buttonText: {
        color: 'white',
        fontSize: 16
    }
});
export default LoginScreen;
