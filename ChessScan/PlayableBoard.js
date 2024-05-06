import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default function PlayableBoard({ route }) {
  const { FEN } = route.params; // Get FEN from route parameters
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chess Board FEN</Text>
      <Text style={styles.fen}>{FEN}</Text>
          {}
      </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fen: {
    fontSize: 16,
    textAlign: 'center',
  },
});
