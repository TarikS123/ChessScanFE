import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';

const pieceImages = {
    'p': require('../assets/pieces/bp.png'), 'r': require('../assets/pieces/br.png'),
    'n': require('../assets/pieces/bn.png'), 'b': require('../assets/pieces/bb.png'),
    'q': require('../assets/pieces/bq.png'), 'k': require('../assets/pieces/bk.png'),
    'P': require('../assets/pieces/wp.png'), 'R': require('../assets/pieces/wr.png'),
    'N': require('../assets/pieces/wn.png'), 'B': require('../assets/pieces/wb.png'),
    'Q': require('../assets/pieces/wq.png'), 'K': require('../assets/pieces/wk.png'),
};

const decodeFen = (fen) => {
    const rows = fen.split(' ')[0].split('/');
    return rows.map(row => {
        const rowArr = [];
        for (let i = 0; i < row.length; i++) {
            const char = row[i];
            if (isNaN(char)) {
                rowArr.push(char);
            } else {
                for (let j = 0; j < parseInt(char, 10); j++) {
                    rowArr.push(null);
                }
            }
        }
        return rowArr;
    });
};

const ChessBoardMP = ({ gameId, userId, currentTurn }) => {
    const [board, setBoard] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState(null);

    const fetchGameState = async () => {
        try {
            const response = await fetch(`https://44dd-77-238-198-52.ngrok-free.app/get_game?game_id=${gameId}`);
            const data = await response.json();
            if (response.ok) {
                setBoard(decodeFen(data.game_state));
            } else {
                throw new Error(data.error || "Failed to fetch game state");
            }
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    useEffect(() => {
        fetchGameState();
        if (currentTurn !== userId) {
            const interval = setInterval(fetchGameState, 3000);  // Poll every 3 seconds
            return () => clearInterval(interval);
        }
    }, [currentTurn, gameId, userId]);

    const handleMove = async (newBoard) => {
        const fen = arrayToFen(newBoard);  // Convert the 2D array to FEN before sending
        try {   
            console.log("Sending FEN to server:", fen);
            const response = await fetch(`https://44dd-77-238-198-52.ngrok-free.app/make_move`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    game_id: gameId,
                    player_id: userId,
                    new_state: fen,
                })
            });
            if (response.ok) {
                fetchGameState();  // Refresh the board state after a move
            } else {
                const data = await response.json();
                throw new Error(data.error || "Failed to make move");
            }
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    const handleTilePress = (rowIndex, colIndex) => {
        const currentPiece = board[rowIndex][colIndex];
        if (selectedPosition) {
            const [selectedRow, selectedCol] = selectedPosition;
            const selectedPiece = board[selectedRow][selectedCol];
            const newBoard = [...board.map(row => [...row])];
            newBoard[rowIndex][colIndex] = selectedPiece;
            newBoard[selectedRow][selectedCol] = null;
            setBoard(newBoard);
            handleMove(newBoard);
            setSelectedPosition(null);
        } else if (currentPiece) {
            setSelectedPosition([rowIndex, colIndex]);
        }
    };

    const arrayToFen = (board) => {
        let fen = "";
        for (let i = 0; i < board.length; i++) {
            let emptyCount = 0;
            for (let j = 0; j < board[i].length; j++) {
                const cell = board[i][j];
                if (cell === null) {
                    emptyCount++;
                } else {
                    if (emptyCount > 0) {
                        fen += emptyCount;
                        emptyCount = 0;
                    }
                    fen += cell;
                }
            }
            if (emptyCount > 0) {
                fen += emptyCount;
            }
            if (i < board.length - 1) fen += "/";
        }
        return fen;
    };
    
    

    return (
        <View style={styles.board}>
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <TouchableOpacity
                        key={`${rowIndex}-${colIndex}`}
                        onPress={() => handleTilePress(rowIndex, colIndex)}
                        style={[
                            styles.tile,
                            { backgroundColor: (rowIndex + colIndex) % 2 === 0 ? 'white' : 'gray' }
                        ]}
                    >
                        {cell && <Image source={pieceImages[cell]} style={styles.piece} />}
                    </TouchableOpacity>
                ))
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    board: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 320,
        height: 320,
    },
    tile: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    piece: {
        width: 36,
        height: 36,
    }
});

export default ChessBoardMP;
