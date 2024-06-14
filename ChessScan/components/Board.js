import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Button, Text, Alert } from 'react-native';
import axios from 'axios'; // Ensure axios is installed via npm or yarn

const pieceImages = {
  'p': require('../assets/pieces/bp.png'),
  'r': require('../assets/pieces/br.png'),
  'n': require('../assets/pieces/bn.png'),
  'b': require('../assets/pieces/bb.png'),
  'q': require('../assets/pieces/bq.png'),
  'k': require('../assets/pieces/bk.png'),
  'P': require('../assets/pieces/wp.png'),
  'R': require('../assets/pieces/wr.png'),
  'N': require('../assets/pieces/wn.png'),
  'B': require('../assets/pieces/wb.png'),
  'Q': require('../assets/pieces/wq.png'),
  'K': require('../assets/pieces/wk.png'),
};

function decodeFen(fen) {
  const rows = fen.split(' ')[0].split('/');
  const board = rows.map(row => {
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
  return board;
}

function encodeFen(board) {
  return board.map(row => {
    let currentFen = '';
    let emptyCount = 0;
    row.forEach(cell => {
      if (cell === null) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          currentFen += emptyCount.toString();
          emptyCount = 0;
        }
        currentFen += cell;
      }
    });
    if (emptyCount > 0) {
      currentFen += emptyCount.toString();
    }
    return currentFen;
  }).join('/');
}


const Chessboard = ({ initialFen, onFenChange }) => {
  const [board, setBoard] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    setBoard(decodeFen(initialFen));
  }, [initialFen]);

  const handleTilePress = (rowIndex, colIndex) => {
    const currentPiece = board[rowIndex][colIndex];
  
    if (isEditMode) {
      const newBoard = [...board];
      newBoard[rowIndex][colIndex] = selectedPiece;
      setBoard(newBoard);
    } else {
      if (selectedPiece === null && currentPiece !== null) {
        // Select the piece to move
        setSelectedPiece(currentPiece);
        setSelectedPosition([rowIndex, colIndex]); // Set the selected position
      } else if (selectedPiece !== null) {
        if (currentPiece !== null && currentPiece[0] === selectedPiece[0]) {
          // If the same player's piece is selected, update the selection
          setSelectedPiece(currentPiece);
          setSelectedPosition([rowIndex, colIndex]);
        } else {
          // Move the selected piece
          const newBoard = [...board];
          newBoard[rowIndex][colIndex] = selectedPiece; // Place the selected piece here
          newBoard[selectedPosition[0]][selectedPosition[1]] = null; // Clear the original position
          setBoard(newBoard);
          const fen = encodeFen(newBoard);
          onFenChange(fen);
          handleAPIRequest(fen);
          setSelectedPiece(null); // Reset selection after move
          setSelectedPosition(null); // Reset position after move
        }
      }
    }
  };
  
  
  
  <Button title={isEditMode ? "Confirm Board" : "Edit Board"} onPress={() => {
    setIsEditMode(!isEditMode);
    setSelectedPiece(null); // Ensure no piece is selected when switching modes
  }} />
  

  const handleAPIRequest = async (fen) => {
    const params = new URLSearchParams();
    params.append('fen', `${fen} b - - 0 1`); // Modify this as required by the new API
  
    const options = {
      method: 'POST',
      url: 'https://chess-stockfish-16-api.p.rapidapi.com/chess/api',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': 'baaa439d20msh6e507a8fa2583cfp1364f8jsn177abeb1aca9', // Ensure to use your actual API key
        'X-RapidAPI-Host': 'chess-stockfish-16-api.p.rapidapi.com'
      },
      data: params,
    };
  
    try {
      const response = await axios(options);
     // console.log("API response:", response); // Log the entire response object
  
      if (response.data && response.data.bestmove) {
        const { bestmove: move } = response.data;
        const updatedBoard = applyMove(decodeFen(fen), move);
        const newFen = encodeFen(updatedBoard);
        setBoard(updatedBoard);
        onFenChange(newFen);
      } else {
        console.error('Unexpected API response:', response.data);
        Alert.alert('API Error', 'Received unexpected response from the chess API.');
      }
    } catch (error) {
      console.error('Error contacting the chess API:', error);
      Alert.alert('API Error', 'Failed to make a move. Check your connection and API.');
    }
  };
  
  const applyMove = (board, move) => {
    const from = move.substring(0, 2);
    const to = move.substring(2, 4);
    const fromRow = 8 - parseInt(from[1]);
    const fromCol = from.charCodeAt(0) - 'a'.charCodeAt(0);
    const toRow = 8 - parseInt(to[1]);
    const toCol = to.charCodeAt(0) - 'a'.charCodeAt(0);
    const piece = board[fromRow][fromCol];
    const newBoard = [...board.map(row => [...row])];
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;
    return newBoard;
};


  return (
    <View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 320, height: 320 }}>
        {board.map((row, rowIndex) => row.map((cell, colIndex) => (
          <TouchableOpacity key={`${rowIndex}-${colIndex}`} onPress={() => handleTilePress(rowIndex, colIndex)}>
            <View style={{
              width: 40,
              height: 40,
              backgroundColor: (rowIndex + colIndex) % 2 === 0 ? 'white' : 'gray',
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: 'transparent',
              borderWidth: 2,
            }}>
              {cell && <Image source={pieceImages[cell]} style={{ width: 36, height: 36 }} />}
            </View>
          </TouchableOpacity>
        )))}
      </View>
      {isEditMode && (
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 }}>
            {Object.keys(pieceImages).slice(0, 6).map(piece => (
              <TouchableOpacity key={piece} onPress={() => setSelectedPiece(piece)}>
                <Image source={pieceImages[piece]} style={{ width: 45, height: 45, margin: 5 }} />
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 5 }}>
            {Object.keys(pieceImages).slice(6).map(piece => (
              <TouchableOpacity key={piece} onPress={() => setSelectedPiece(piece)}>
                <Image source={pieceImages[piece]} style={{ width: 45, height: 45, margin: 5 }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
          )}
          <Button title={isEditMode ? "Confirm Board" : "Edit Board"} onPress={() => {
        setIsEditMode(!isEditMode);
        if (!isEditMode) {
          setSelectedPiece(null); // Deselect piece when switching back to edit mode
        }
      }} />
    </View>
  );
};

export default Chessboard;
