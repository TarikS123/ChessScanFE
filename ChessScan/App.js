import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ImageScan from './ImageScan';
import PlayableBoard from './PlayableBoard';
import Chessboard from 'react-native-chessboardjs';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
    const boardSize = 150; // Adjust the board size as needed

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Open up App.js to start working on your app!</Text>
            <Button
                title="Scan Board"
                onPress={() => navigation.navigate('ImageScan')}
            />
            <StatusBar style="auto" />
            <View style={styles.boardContainer}>
                <Chessboard
                    position="pppp" // Starting position or any other FEN string
                />
            </View>
        </View>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="ImageScan" component={ImageScan} />
                <Stack.Screen name="PlayableBoard" component={PlayableBoard} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        marginBottom: 20,
    },
    boardContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 50,
        marginRight: 415
    },
});
