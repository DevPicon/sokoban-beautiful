export enum EntityType {
  WALL = '#',
  FLOOR = ' ',
  SPOT = '.',
  BOX = '$',
  PLAYER = '@',
  BOX_ON_SPOT = '*',
  PLAYER_ON_SPOT = '+',
  VOID = '_'
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export interface Position {
  x: number;
  y: number;
}

export interface LevelConfig {
  id: number;
  map: string[]; // Array of strings representing rows
  parMoves: number;
  parPushes: number;
  solution?: string; // Text description or sequence of moves
  demoMoves?: string; // String of characters 'u','d','l','r' for auto-play
}

export interface GameState {
  grid: EntityType[][];
  playerPos: Position;
  moves: number;
  pushes: number;
  levelComplete: boolean;
  stars: number;
}

export enum Screen {
  MENU = 'MENU',
  LEVEL_SELECT = 'LEVEL_SELECT',
  GAME = 'GAME',
  INSTRUCTIONS = 'INSTRUCTIONS'
}

export interface LevelCompletion {
  levelId: number;
  stars: number;
  completed: boolean;
}

// For easy Kotlin migration, we treat the grid as a flat structure logically in some contexts,
// but 2D array is easier for React rendering.