import React, { useState, useEffect } from 'react';
import { View, Button, Text, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChessBoardMP from './ChessBoardMP'; // Ensure the path is correct

const MultiPlayerGame = () => {
    const [gameId, setGameId] = useState(null);
    const [currentTurn, setCurrentTurn] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const getUserId = async () => {
            const jsonValue = await AsyncStorage.getItem('user');
            const userData = jsonValue ? JSON.parse(jsonValue) : null;
            if (userData && userData.id) {
                setUserId(userData.id);
            }
        };
        getUserId();
    }, []);

    const findMatch = async () => {
        if (!userId) {
            Alert.alert("Error", "User ID is not available.");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('https://44dd-77-238-198-52.ngrok-free.app/create_game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    player1_id: userId  // Make sure `userId` is set correctly from AsyncStorage
                })
            });
            const data = await response.json();
            if (response.ok) {
                setGameId(data.game_id);
                setCurrentTurn(data.current_turn);  // Assuming this is also returned by the API
                Alert.alert("Match found", data.message);
            } else {
                throw new Error(data.message || "Failed to find match");
            }
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {loading ? <ActivityIndicator size="large" color="#0000ff" /> : (
                <>
                    <Button title="Find Match" onPress={findMatch} disabled={!userId} />
                    {gameId && (
                        <>
                            <Text>Game ID: {gameId}</Text>
                            <Text>It's {currentTurn === userId ? "your turn" : "opponent's turn"}</Text>
                            <ChessBoardMP gameId={gameId} userId={userId} />
                        </>
                    )}
                </>
            )}
        </View>
    );
};

export default MultiPlayerGame;
