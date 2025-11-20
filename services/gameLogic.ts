import { Direction, EntityType, GameState, LevelConfig, Position } from '../types';

/**
 * Parses a level string array into a usable GameState.
 * This logic is isolated so it can be ported to a Kotlin factory pattern easily.
 */
export const initializeLevel = (level: LevelConfig): GameState => {
  const rows = level.map.length;
  const grid: EntityType[][] = [];
  let playerPos: Position = { x: 0, y: 0 };

  for (let y = 0; y < rows; y++) {
    const rowStr = level.map[y];
    const row: EntityType[] = [];
    for (let x = 0; x < rowStr.length; x++) {
      const char = rowStr[x];
      let type = EntityType.VOID;

      switch (char) {
        case '#': type = EntityType.WALL; break;
        case ' ': type = EntityType.FLOOR; break;
        case '.': type = EntityType.SPOT; break;
        case '$': type = EntityType.BOX; break;
        case '@': type = EntityType.PLAYER; playerPos = { x, y }; break;
        case '*': type = EntityType.BOX_ON_SPOT; break;
        case '+': type = EntityType.PLAYER_ON_SPOT; playerPos = { x, y }; break;
        default: type = EntityType.FLOOR;
      }
      row.push(type);
    }
    grid.push(row);
  }

  return {
    grid,
    playerPos,
    moves: 0,
    pushes: 0,
    levelComplete: false,
    stars: 0
  };
};

/**
 * Calculates the next position based on direction.
 */
const getNextPosition = (pos: Position, dir: Direction): Position => {
  switch (dir) {
    case Direction.UP: return { x: pos.x, y: pos.y - 1 };
    case Direction.DOWN: return { x: pos.x, y: pos.y + 1 };
    case Direction.LEFT: return { x: pos.x - 1, y: pos.y };
    case Direction.RIGHT: return { x: pos.x + 1, y: pos.y };
  }
};

/**
 * Determines if a tile contains a box.
 */
const isBox = (type: EntityType): boolean => {
  return type === EntityType.BOX || type === EntityType.BOX_ON_SPOT;
};

/**
 * Determines if a tile is a wall.
 */
const isWall = (type: EntityType): boolean => {
  return type === EntityType.WALL;
};

/**
 * Returns the "base" floor type for a tile (Spot or Floor).
 * Used when an entity moves OFF a tile.
 */
const getBaseTile = (currentType: EntityType): EntityType => {
  if (currentType === EntityType.PLAYER_ON_SPOT || currentType === EntityType.BOX_ON_SPOT || currentType === EntityType.SPOT) {
    return EntityType.SPOT;
  }
  return EntityType.FLOOR;
};

/**
 * Returns the new tile type when an entity moves ONTO a tile.
 */
const getNewTileType = (targetBase: EntityType, entity: 'PLAYER' | 'BOX'): EntityType => {
  if (targetBase === EntityType.SPOT || targetBase === EntityType.BOX_ON_SPOT || targetBase === EntityType.PLAYER_ON_SPOT) {
    return entity === 'PLAYER' ? EntityType.PLAYER_ON_SPOT : EntityType.BOX_ON_SPOT;
  }
  return entity === 'PLAYER' ? EntityType.PLAYER : EntityType.BOX;
};

/**
 * Checks if the level is solved (no loose boxes left).
 */
const checkWinCondition = (grid: EntityType[][]): boolean => {
  for (const row of grid) {
    for (const cell of row) {
      if (cell === EntityType.BOX) return false; // Found a box not on a spot
    }
  }
  return true;
};

/**
 * Calculates stars based on performance vs par.
 */
const calculateStars = (moves: number, pushes: number, parMoves: number, parPushes: number): number => {
  // Simple heuristic:
  // 3 stars: <= 1.1x par moves AND <= 1.1x par pushes
  // 2 stars: <= 1.5x par moves OR <= 1.5x par pushes
  // 1 star: anything else
  if (moves <= parMoves * 1.2 && pushes <= parPushes * 1.2) return 3;
  if (moves <= parMoves * 1.6 || pushes <= parPushes * 1.6) return 2;
  return 1;
};

/**
 * Main movement logic.
 * Returns a NEW GameState (immutable update) to be React-friendly and Functional-friendly.
 */
export const processMove = (currentState: GameState, direction: Direction, levelConfig: LevelConfig): GameState => {
  if (currentState.levelComplete) return currentState;

  const { grid, playerPos, moves, pushes } = currentState;
  const nextPos = getNextPosition(playerPos, direction);

  // Bounds check
  if (nextPos.y < 0 || nextPos.y >= grid.length || nextPos.x < 0 || nextPos.x >= grid[0].length) {
    return currentState;
  }

  const targetTile = grid[nextPos.y][nextPos.x];

  // 1. Hit Wall
  if (isWall(targetTile)) return currentState;

  // Deep copy grid for mutation
  const newGrid = grid.map(row => [...row]);
  let newMoves = moves;
  let newPushes = pushes;
  let moved = false;

  // 2. Empty Floor or Spot
  if (!isBox(targetTile)) {
    // Move Player
    const currentBase = getBaseTile(newGrid[playerPos.y][playerPos.x]);
    newGrid[playerPos.y][playerPos.x] = currentBase;

    const targetBase = getBaseTile(targetTile);
    newGrid[nextPos.y][nextPos.x] = getNewTileType(targetTile, 'PLAYER'); // Actually we need the base of the target

    newMoves++;
    moved = true;
  }
  // 3. Push Box
  else {
    const boxNextPos = getNextPosition(nextPos, direction);
    // Check bounds for box
    if (boxNextPos.y < 0 || boxNextPos.y >= grid.length || boxNextPos.x < 0 || boxNextPos.x >= grid[0].length) {
      return currentState;
    }

    const boxTargetTile = newGrid[boxNextPos.y][boxNextPos.x];

    // Can only push into Floor or Spot (not Wall, not another Box)
    if (!isWall(boxTargetTile) && !isBox(boxTargetTile)) {
      // Move Player
      const playerBase = getBaseTile(newGrid[playerPos.y][playerPos.x]);
      newGrid[playerPos.y][playerPos.x] = playerBase;

      // Move Box (The player takes the box's old spot)
      const boxOldBase = getBaseTile(targetTile); // Was the box on a spot?
      newGrid[nextPos.y][nextPos.x] = getNewTileType(boxOldBase, 'PLAYER');

      // Place Box in new spot
      newGrid[boxNextPos.y][boxNextPos.x] = getNewTileType(boxTargetTile, 'BOX');

      newMoves++;
      newPushes++;
      moved = true;
    }
  }

  if (!moved) return currentState;

  const isWin = checkWinCondition(newGrid);
  const stars = isWin ? calculateStars(newMoves, newPushes, levelConfig.parMoves, levelConfig.parPushes) : 0;

  return {
    grid: newGrid,
    playerPos: moved ? nextPos : playerPos,
    moves: newMoves,
    pushes: newPushes,
    levelComplete: isWin,
    stars: stars
  };
};
