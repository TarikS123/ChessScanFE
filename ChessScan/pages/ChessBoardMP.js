import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import URL from '../utils/connection';
import { Chess } from 'chess.js';

const pieceImages = {
    'p': require('../assets/pieces/bp.png'), 'r': require('../assets/pieces/br.png'),
    'n': require('../assets/pieces/bn.png'), 'b': require('../assets/pieces/bb.png'),
    'q': require('../assets/pieces/bq.png'), 'k': require('../assets/pieces/bk.png'),
    'P': require('../assets/pieces/wp.png'), 'R': require('../assets/pieces/wr.png'),
    'N': require('../assets/pieces/wn.png'), 'B': require('../assets/pieces/wb.png'),
    'Q': require('../assets/pieces/wq.png'), 'K': require('../assets/pieces/wk.png'),
};

const ChessBoardMP = ({ gameId, userId }) => {
    const [game, setGame] = useState(new Chess());
    const [board, setBoard] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [availableMoves, setAvailableMoves] = useState([]);
    const [playerColor, setPlayerColor] = useState(null);
    const [currentTurn, setCurrentTurn] = useState(null); // Track who's turn it is

    useEffect(() => {
        fetchGameState();
        const interval = setInterval(fetchGameState, 3000);
        return () => clearInterval(interval);
    }, [gameId, userId]);

    const fetchGameState = async () => {
        try {
            const response = await fetch(`${URL}/get_game?game_id=${gameId}`);
            const data = await response.json();
            if (response.ok) {
                game.load(data.game_state);
                setPlayerColor(data.player_color);
                setCurrentTurn(data.current_turn); // Assume this info is sent by the server
                setBoard(decodeFen(game.fen()));
            } else {
                throw new Error(data.error || "Failed to fetch game state");
            }
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    const decodeFen = (fen) => {
        let rows = fen.split(' ')[0].split('/');
        if (playerColor === 'black') {
            rows = rows.reverse().map(row => row.split('').reverse().join(''));
        }
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

    const handleTilePress = async (rowIndex, colIndex) => {
        if (currentTurn !== userId) {
            Alert.alert("Not Your Turn", "Please wait for your turn.");
            return;
        }

        if (playerColor === 'black') {
            rowIndex = 7 - rowIndex;
            colIndex = 7 - colIndex;
        }
        const position = positionToAlgebraic(rowIndex, colIndex);
        const moves = game.moves({ square: position, verbose: true });

        if (selectedPosition && (rowIndex === selectedPosition[0] && colIndex === selectedPosition[1])) {
            setSelectedPosition(null);
            setAvailableMoves([]);
        } else {
            if (selectedPosition) {
                const move = createMoveObject(selectedPosition, rowIndex, colIndex);
                if (game.move(move)) {
                    setBoard(decodeFen(game.fen()));
                    await handleMove(game.fen());
                    setSelectedPosition(null);
                    setAvailableMoves([]);
                    setCurrentTurn(game.turn() === 'w' ? 'white' : 'black'); // Update turn based on chess.js state
                } else {
                    Alert.alert("Invalid Move", "This move is not allowed.", [{ text: "OK" }]);
                    game.undo();
                }
            } else {
                setSelectedPosition([rowIndex, colIndex]);
                setAvailableMoves(moves.map(move => move.to));
            }
        }
    };

    const handleMove = async (fen) => {
        try {
            const response = await fetch(`${URL}/make_move`, {
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
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to make move");
            }
        } catch (error) {
            Alert.alert("Error", error.message);
            game.undo(); // Revert the last move if the server update fails
            setBoard(decodeFen(game.fen()));
        }
    };

    const positionToAlgebraic = (row, col) => {
        const file = String.fromCharCode('a'.charCodeAt(0) + col);
        const rank = 8 - row;
        return `${file}${rank}`;
    };

    const createMoveObject = (fromPosition, toRow, toCol) => {
        return {
            from: positionToAlgebraic(fromPosition[0], fromPosition[1]),
            to: positionToAlgebraic(toRow, toCol),
            promotion: 'q'  // Default to promoting to a queen
        };
    };

    const getTileColor = (rowIndex, colIndex) => {
        if (playerColor === 'black') {
            rowIndex = 7 - rowIndex;
            colIndex = 7 - colIndex;
        }
        const position = positionToAlgebraic(rowIndex, colIndex);
        if (selectedPosition && position === positionToAlgebraic(selectedPosition[0], selectedPosition[1])) {
            return 'blue'; // Highlight the selected piece
        } else if (availableMoves.includes(position)) {
            return game.get(position) ? 'red' : 'pink'; // Highlight available moves
        } else {
            return (rowIndex + colIndex) % 2 === 0 ? 'white' : 'gray'; // Normal tile colors
        }
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
                            { backgroundColor: getTileColor(rowIndex, colIndex) }
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
        width: 404,
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: 'black',
    },
    tile: {
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    piece: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
});

export default ChessBoardMP;
