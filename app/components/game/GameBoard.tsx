import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Animated, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const BOARD_PADDING = 10;
const CELL_MARGIN = 2;
const NUM_COLUMNS = 8;
const NUM_ROWS = 8;

// Calculate cell size based on screen dimensions
const CELL_SIZE = (() => {
  const widthBased = (screenWidth / 1.25 - BOARD_PADDING * 2 - CELL_MARGIN * (NUM_COLUMNS - 1)) / NUM_COLUMNS;
  const heightBased = (screenHeight * 0.7 - BOARD_PADDING * 2 - CELL_MARGIN * NUM_ROWS) / (NUM_ROWS + 1);
  return Math.min(widthBased, heightBased);
})();

interface GameBoardProps {
  board: number[][];
  onColumnPress: (column: number) => void;
  playerColor: string;
  opponentColor: string;
  lastPutBall: [number, number];
  winningBalls: Array<[number, number]>;
  isInteractive: boolean;
}

export default function GameBoard({
  board,
  onColumnPress,
  playerColor,
  opponentColor,
  lastPutBall,
  winningBalls,
  isInteractive,
}: GameBoardProps) {
  const [hoverColumn, setHoverColumn] = useState<number | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (winningBalls.length > 0) {
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

  // Check if column is full
  const isColumnFull = (column: number): boolean => board[board.length - 1][column] !== 0;

  // Render a single cell
  const renderCell = (row: number, col: number) => {
    const isLastPut = lastPutBall[0] === row && lastPutBall[1] === col;
    const isWinning = winningBalls.some(([r, c]) => r === row && c === col);

    // Determine cell color
    let backgroundColor = 'white';
    if (board[row][col] === 1) backgroundColor = playerColor;
    else if (board[row][col] === 2) backgroundColor = opponentColor;

    const cellStyle = {
      ...styles.cell,
      backgroundColor,
      borderColor: isLastPut ? '#ffeb3b' : 'gray',
      borderWidth: isLastPut ? 3 : 1,
    };

    return isWinning ? (
      <Animated.View
        key={`cell-${row}-${col}`}
        style={{ ...cellStyle, transform: [{ scale: pulseAnim }] }}
      />
    ) : (
      <View key={`cell-${row}-${col}`} style={cellStyle} />
    );
  };

  return (
    <View style={styles.container}>
      {/* Preview token */}
      {isInteractive && hoverColumn !== null && !isColumnFull(hoverColumn) && (
        <View style={[styles.preview, { left: hoverColumn * (CELL_SIZE + CELL_MARGIN) + BOARD_PADDING }]}>
          <View style={[styles.previewBall, { backgroundColor: playerColor }]} />
        </View>
      )}

      {/* Game board */}
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

      {/* Touch areas */}
      {isInteractive && (
        <View style={styles.touchLayer}>
          {Array(board[0].length).fill(null).map((_, colIndex) => (
            <TouchableWithoutFeedback
              key={`column-${colIndex}`}
              onPress={() => !isColumnFull(colIndex) && onColumnPress(colIndex)}
              onPressIn={() => setHoverColumn(colIndex)}
              onPressOut={() => setHoverColumn(null)}
            >
              <View
                style={[
                  styles.columnTouchArea,
                  isColumnFull(colIndex) && styles.columnFull,
                ]}
              />
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
    justifyContent: 'center',
    width: '100%',
  },
  board: {
    backgroundColor: '#2c3e50',
    borderRadius: 10,
    padding: BOARD_PADDING,
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
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: CELL_SIZE / 2,
    margin: CELL_MARGIN,
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
    top: -CELL_SIZE,
    zIndex: 10,
  },
  previewBall: {
    width: CELL_SIZE * 0.75,
    height: CELL_SIZE * 0.75,
    borderRadius: (CELL_SIZE * 0.75) / 2,
    opacity: 0.8,
  },
});