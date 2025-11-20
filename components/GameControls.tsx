import React, { useState } from 'react';
import { Direction } from '../types';

interface GameControlsProps {
  levelId: number;
  moves: number;
  pushes: number;
  parMoves: number;
  parPushes: number;
  retryCount: number;
  solution?: string;
  demoAvailable?: boolean;
  isAutoSolving?: boolean;
  onReset: () => void;
  onMove: (d: Direction) => void;
  onNextLevel: () => void;
  onPrevLevel: () => void;
  onAutoSolve: () => void;
  totalLevels: number;
}

export const GameControls: React.FC<GameControlsProps> = ({
  levelId,
  moves,
  pushes,
  parMoves,
  parPushes,
  retryCount,
  solution,
  demoAvailable,
  isAutoSolving,
  onReset,
  onMove,
  onNextLevel,
  onPrevLevel,
  onAutoSolve,
  totalLevels
}) => {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="flex flex-col gap-4 w-full max-w-md p-4 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      {/* Header / Stats */}
      <div className="flex justify-between items-center border-b border-gray-600 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Level {levelId}</h2>
          <div className="flex gap-2 text-sm text-gray-400">
            <button onClick={onPrevLevel} disabled={levelId === 1} className="hover:text-white disabled:opacity-30">&larr; Prev</button>
            <span>/</span>
            <button onClick={onNextLevel} disabled={levelId === totalLevels} className="hover:text-white disabled:opacity-30">Next &rarr;</button>
          </div>
        </div>
        <div className="text-right">
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Moves: <span className={`font-mono font-bold ${moves > parMoves ? 'text-orange-400' : 'text-white'}`}>{moves}</span> <span className="text-xs">/ {parMoves}</span></span>
            <span className="text-sm text-gray-400">Pushes: <span className={`font-mono font-bold ${pushes > parPushes ? 'text-orange-400' : 'text-white'}`}>{pushes}</span> <span className="text-xs">/ {parPushes}</span></span>
          </div>
        </div>
      </div>

      {/* Hint System - Appears after 3 retries */}
      {retryCount >= 3 && solution && (
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg overflow-hidden transition-all duration-300">
          <button 
            onClick={() => setShowSolution(!showSolution)}
            className="w-full px-4 py-2 flex items-center justify-between text-yellow-500 hover:text-yellow-400 font-medium text-sm"
          >
            <span className="flex items-center gap-2">
              💡 Stuck? ({retryCount} retries)
            </span>
            <span>{showSolution ? 'Hide' : 'Show'} Help</span>
          </button>
          
          <div 
            className={`
              bg-gray-900/50 px-4 text-sm text-gray-300 transition-all duration-300 ease-in-out flex flex-col gap-2
              ${showSolution ? 'max-h-64 py-3 opacity-100 overflow-y-auto' : 'max-h-0 py-0 opacity-0 overflow-hidden'}
            `}
          >
            <p className="whitespace-pre-line leading-relaxed italic mb-2">{solution}</p>
            
            {demoAvailable && (
              <button 
                onClick={onAutoSolve}
                disabled={isAutoSolving}
                className="self-start text-xs bg-blue-700 hover:bg-blue-600 disabled:bg-gray-600 text-white px-3 py-1 rounded flex items-center gap-1 transition-colors"
              >
                {isAutoSolving ? 'Watching AI...' : '▶ Watch AI Solve'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* D-Pad for Mobile / Touch */}
      <div className={`grid grid-cols-3 gap-2 max-w-[200px] mx-auto md:hidden ${isAutoSolving ? 'opacity-50 pointer-events-none' : ''}`}>
        <div></div>
        <button
          className="bg-gray-700 active:bg-blue-600 p-4 rounded-lg shadow-md transition-colors"
          onClick={() => onMove(Direction.UP)}
        >
          ▲
        </button>
        <div></div>
        <button
          className="bg-gray-700 active:bg-blue-600 p-4 rounded-lg shadow-md transition-colors"
          onClick={() => onMove(Direction.LEFT)}
        >
          ◀
        </button>
        <button
          className="bg-gray-700 active:bg-blue-600 p-4 rounded-lg shadow-md transition-colors"
          onClick={() => onMove(Direction.DOWN)}
        >
          ▼
        </button>
        <button
          className="bg-gray-700 active:bg-blue-600 p-4 rounded-lg shadow-md transition-colors"
          onClick={() => onMove(Direction.RIGHT)}
        >
          ▶
        </button>
      </div>

      {/* Actions */}
      <button
        onClick={onReset}
        disabled={isAutoSolving}
        className="w-full py-2 mt-2 text-sm font-medium bg-red-600 hover:bg-red-500 disabled:bg-gray-600 rounded-lg transition-colors text-white uppercase tracking-wider"
      >
        {isAutoSolving ? 'Auto-Solving...' : 'Reset Level (R)'}
      </button>
    </div>
  );
};