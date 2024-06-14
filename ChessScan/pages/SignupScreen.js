import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

const SignupScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = () => {
        const userDetails = {
            username,
            email,
            password
        };

        fetch('https://44dd-77-238-198-52.ngrok-free.app/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userDetails)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    Alert.alert('Success', data.message);
                    // Optionally navigate to another screen
                    navigation.navigate('Log In');  // Assuming 'Home' is the next screen after signup
                } else {
                    throw new Error(data.error || 'Unknown error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Alert.alert('Error', error.message || 'Failed to create an account. Please try again later.');
            });
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
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('Log In')}>
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
        marginTop:50,
    },
    input: {
        width: '80%',
        height: 50,
        marginVertical: 10,
        borderWidth: 1,
        padding: 10,
        borderColor: '#ddd',
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
    button2: {
        backgroundColor: '#8a6240',
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

export default SignupScreen;
