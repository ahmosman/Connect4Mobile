import React, { useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Animated } from 'react-native';

interface GameBoardProps {
  board: number[][]; // 0 - puste, 1 - gracz, 2 - przeciwnik
  onColumnPress: (column: number) => void;
  playerColor: string;
  opponentColor: string;
  lastPutBall: [number, number]; // ostatnio wstawiony żeton
  winningBalls: Array<[number, number]>; // zwycięskie żetony
  isInteractive: boolean; // czy plansza reaguje na dotyk
}

export default function GameBoard({
  board,
  onColumnPress,
  playerColor,
  opponentColor,
  lastPutBall,
  winningBalls,
  isInteractive
}: GameBoardProps) {
  const [hoverColumn, setHoverColumn] = useState<number | null>(null);
  
  // Animacja dla wygrywających żetonów
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  
  React.useEffect(() => {
    if (winningBalls && winningBalls.length > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [winningBalls, pulseAnim]);

  // Renderowanie pojedynczej komórki
  const renderCell = (row: number, col: number) => {
    const isLastPutBall = lastPutBall[0] === row && lastPutBall[1] === col;
    const isWinningBall = winningBalls.some(([r, c]) => r === row && c === col);
    
    // Kolor żetonu
    let backgroundColor = 'white';
    if (board[row][col] === 1) backgroundColor = playerColor;
    else if (board[row][col] === 2) backgroundColor = opponentColor;
    
    // Style
    const cellStyle = {
      ...styles.cell,
      backgroundColor,
      borderColor: isLastPutBall ? '#ffeb3b' : 'gray',
      borderWidth: isLastPutBall ? 3 : 1,
    };
    
    return isWinningBall ? (
      <Animated.View 
        key={`cell-${row}-${col}`} 
        style={{...cellStyle, transform: [{ scale: pulseAnim }]}} 
      />
    ) : (
      <View key={`cell-${row}-${col}`} style={cellStyle} />
    );
  };

  // Czy kolumna jest pełna
  const isColumnFull = (column: number): boolean => {
    return board[board.length - 1][column] !== 0;
  };

  return (
    <View style={styles.container}>
      {/* Podgląd żetonu */}
      {isInteractive && hoverColumn !== null && !isColumnFull(hoverColumn) && (
        <View style={[styles.preview, { left: hoverColumn * 44 + 10 }]}>
          <View style={[styles.previewBall, { backgroundColor: playerColor }]} />
        </View>
      )}
      
      {/* Plansza */}
      <View style={styles.board}>
        {board.slice().reverse().map((row, reversedRowIndex) => {
          const actualRowIndex = board.length - 1 - reversedRowIndex;
          return (
            <View key={`row-${actualRowIndex}`} style={styles.row}>
              {row.map((_, colIndex) => renderCell(actualRowIndex, colIndex))}
            </View>
          );
        })}
      </View>
      
      {/* Obszary dotykowe */}
      {isInteractive && (
        <View style={styles.touchLayer}>
          {Array(board[0].length).fill(0).map((_, colIndex) => (
            <TouchableWithoutFeedback 
              key={`column-${colIndex}`}
              onPress={() => !isColumnFull(colIndex) ? onColumnPress(colIndex) : null}
              onPressIn={() => setHoverColumn(colIndex)}
              onPressOut={() => setHoverColumn(null)}
            >
              <View style={[
                styles.columnTouchArea, 
                isColumnFull(colIndex) && styles.columnFull
              ]} />
            </TouchableWithoutFeedback>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
  },
  board: {
    backgroundColor: '#2c3e50',
    borderRadius: 10,
    padding: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 2,
    borderWidth: 1,
    borderColor: 'gray',
  },
  touchLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  columnTouchArea: {
    flex: 1,
    height: '100%',
  },
  columnFull: {
    opacity: 0.3,
  },
  preview: {
    position: 'absolute',
    top: -40,
    zIndex: 10,
  },
  previewBall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    opacity: 0.8,
  }
});