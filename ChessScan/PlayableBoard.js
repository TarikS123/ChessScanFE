import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Chessboard from 'react-native-chessboardjs';

export default function PlayableBoard({ route }) {
    const { FEN } = route.params; // Get FEN from route parameters

    return (
        <SafeAreaView style={styles.container}>
            <Chessboard
                position={FEN || "ppppp"} // Use the passed FEN or default to the starting position
                 // Adjust the size as needed
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginRight: 410
    },
    customDarkSquareStyle: {
        backgroundColor: '#D2691E',
    },
    customLightSquareStyle: {
        backgroundColor: '#DEB887',
    },

});
