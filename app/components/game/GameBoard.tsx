import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Pressable, Animated, Dimensions } from 'react-native';
import { Easing } from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const BOARD_PADDING = 10;
const CELL_MARGIN = 2;
const NUM_COLUMNS = 8;
const NUM_ROWS = 8;

const CELL_SIZE = Math.min(
  (screenWidth / 1.25 - BOARD_PADDING * 2 - CELL_MARGIN * (NUM_COLUMNS - 1)) / NUM_COLUMNS,
  (screenHeight * 0.7 - BOARD_PADDING * 2 - CELL_MARGIN * NUM_ROWS) / (NUM_ROWS + 1)
);

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
  const [isDropping, setIsDropping] = useState(false);
  const [droppingColumn, setDroppingColumn] = useState<number | null>(null);
  const dropAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (winningBalls.length > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 500, useNativeDriver: false }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: false }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [winningBalls, pulseAnim]);

  const isColumnFull = (column: number) => board[board.length - 1][column] !== 0;

  const findLowestEmptyRow = (column: number) =>
    board.findIndex((row) => row[column] === 0);

  const handleColumnPress = (column: number) => {
    if (isDropping || isColumnFull(column)) return;

    const targetRow = findLowestEmptyRow(column);
    if (targetRow !== -1) {
      setIsDropping(true);
      setDroppingColumn(column);

      const targetCellY = (board.length - 1 - targetRow) * (CELL_SIZE + CELL_MARGIN) + BOARD_PADDING;

      dropAnim.setValue(0);
      Animated.timing(dropAnim, {
        toValue: targetCellY,
        duration: 400,
        easing: Easing.in(Easing.exp),
        useNativeDriver: false,
      }).start(() => {
        setIsDropping(false);
        setDroppingColumn(null);
        onColumnPress(column);
      });
    }
  };

  const renderCell = (row: number, col: number) => {
    const isLastPut = lastPutBall[0] === row && lastPutBall[1] === col;
    const isWinning = winningBalls.some(([r, c]) => r === row && c === col);

    const backgroundColor =
      board[row][col] === 1 ? playerColor : board[row][col] === 2 ? opponentColor : 'white';

    const cellStyle = {
      ...styles.cell,
      backgroundColor,
      borderColor: isLastPut ? '#ffeb3b' : 'gray',
      borderWidth: isLastPut ? 3 : 1,
    };

    return isWinning ? (
      <Animated.View key={`cell-${row}-${col}`} style={{ ...cellStyle, transform: [{ scale: pulseAnim }] }} />
    ) : (
      <View key={`cell-${row}-${col}`} style={cellStyle} />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.board}>
        {board.slice().reverse().map((row, reversedRowIndex) => (
          <View key={`row-${reversedRowIndex}`} style={styles.row}>
            {row.map((_, colIndex) => renderCell(board.length - 1 - reversedRowIndex, colIndex))}
          </View>
        ))}
      </View>

      <View style={styles.touchLayer} pointerEvents={isInteractive && !isDropping ? 'auto' : 'none'}>
        {Array(NUM_COLUMNS).fill(null).map((_, colIndex) => (
          <Pressable
            key={`column-${colIndex}`}
            style={[styles.columnTouchArea, isColumnFull(colIndex) && styles.columnFull]}
            onPress={() => handleColumnPress(colIndex)}
          />
        ))}
      </View>

      {isDropping && droppingColumn !== null && (
        <Animated.View
          style={[
            styles.droppingBall,
            {
              top: -CELL_SIZE - CELL_MARGIN,
              backgroundColor: playerColor,
              left: droppingColumn * (CELL_SIZE + CELL_MARGIN) + BOARD_PADDING + (droppingColumn * 2.1),
              transform: [{ translateY: dropAnim }],
            },
          ]}
        />
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
  droppingBall: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: CELL_SIZE / 2,
    zIndex: 100,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
});