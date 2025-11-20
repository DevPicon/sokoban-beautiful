import React, { useEffect, useState, useCallback } from 'react';
import { LEVELS } from './levels';
import { GameState, Direction, Screen, LevelCompletion } from './types';
import { initializeLevel, processMove } from './services/gameLogic';
import { BoardRenderer } from './components/BoardRenderer';
import { GameControls } from './components/GameControls';
import { WinModal } from './components/WinModal';
import { MainMenu } from './components/MainMenu';
import { LevelSelect } from './components/LevelSelect';
import { Instructions } from './components/Instructions';

function App() {
  const [screen, setScreen] = useState<Screen>(Screen.MENU);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState | null>(null);
  
  // Feature: Retry Counter
  const [retryCount, setRetryCount] = useState(0);
  
  // Feature: Auto Solve
  const [isAutoSolving, setIsAutoSolving] = useState(false);
  
  // Persistent progress state (In a real app, use localStorage)
  const [progress, setProgress] = useState<LevelCompletion[]>([]);

  // Update progress when a level is completed
  const updateProgress = useCallback((levelId: number, stars: number) => {
    setProgress(prev => {
      const existing = prev.find(p => p.levelId === levelId);
      if (existing) {
        // Only update if score is better (more stars)
        if (stars > existing.stars) {
          return prev.map(p => p.levelId === levelId ? { ...p, stars } : p);
        }
        return prev;
      }
      return [...prev, { levelId, stars, completed: true }];
    });
  }, []);

  // Game Logic: Load Level (New Level or Level Select)
  const loadLevel = useCallback((index: number) => {
    if (index < 0 || index >= LEVELS.length) return;
    const levelConfig = LEVELS[index];
    setGameState(initializeLevel(levelConfig));
    setCurrentLevelIndex(index);
    setRetryCount(0); // Reset retries when explicitly changing levels
    setIsAutoSolving(false);
    setScreen(Screen.GAME);
  }, []);

  // Game Logic: Restart Current Level (User initiated)
  const restartLevel = useCallback(() => {
    const levelConfig = LEVELS[currentLevelIndex];
    setGameState(initializeLevel(levelConfig));
    setIsAutoSolving(false);
    setRetryCount(prev => prev + 1); // Increment retries on reset
  }, [currentLevelIndex]);

  // Game Logic: Handle Move
  const handleMove = useCallback((direction: Direction) => {
    if (!gameState || gameState.levelComplete || screen !== Screen.GAME) return;

    const currentLevel = LEVELS[currentLevelIndex];
    const newState = processMove(gameState, direction, currentLevel);
    setGameState(newState);

    if (newState.levelComplete) {
      setIsAutoSolving(false);
      updateProgress(currentLevel.id, newState.stars);
    }
  }, [gameState, currentLevelIndex, screen, updateProgress]);

  // Auto-Solve Logic: Playback Engine
  const startAutoSolve = useCallback(() => {
    const levelConfig = LEVELS[currentLevelIndex];
    if (!levelConfig.demoMoves) return;
    
    // Reset level before solving
    setGameState(initializeLevel(levelConfig));
    setIsAutoSolving(true);
    // Note: retryCount is not incremented or reset here specifically, 
    // but user can see it as a "give up" action.
  }, [currentLevelIndex]);

  useEffect(() => {
    if (!isAutoSolving || !gameState || screen !== Screen.GAME) return;

    const levelConfig = LEVELS[currentLevelIndex];
    const demo = levelConfig.demoMoves;

    if (!demo || gameState.moves >= demo.length) {
      setIsAutoSolving(false);
      return;
    }

    const timer = setTimeout(() => {
      const char = demo[gameState.moves].toLowerCase();
      let dir: Direction | null = null;
      switch (char) {
        case 'u': dir = Direction.UP; break;
        case 'd': dir = Direction.DOWN; break;
        case 'l': dir = Direction.LEFT; break;
        case 'r': dir = Direction.RIGHT; break;
      }
      
      if (dir) {
        handleMove(dir);
      } else {
        setIsAutoSolving(false); // Stop on invalid char
      }
    }, 200); // 200ms per move for visibility

    return () => clearTimeout(timer);
  }, [isAutoSolving, gameState, currentLevelIndex, screen, handleMove]);

  // Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screen !== Screen.GAME) {
        if (e.key === 'Escape' && screen !== Screen.MENU) {
           setScreen(Screen.MENU);
        }
        return;
      }

      // Disable keyboard during auto-solve
      if (isAutoSolving) {
        if (e.key === 'Escape') setIsAutoSolving(false); // Allow exit
        return;
      }

      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': handleMove(Direction.UP); break;
        case 'ArrowDown': case 's': case 'S': handleMove(Direction.DOWN); break;
        case 'ArrowLeft': case 'a': case 'A': handleMove(Direction.LEFT); break;
        case 'ArrowRight': case 'd': case 'D': handleMove(Direction.RIGHT); break;
        case 'r': case 'R': restartLevel(); break;
        case 'Escape': setScreen(Screen.MENU); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, restartLevel, loadLevel, currentLevelIndex, screen, isAutoSolving]);

  // --- RENDER SCREENS ---

  const renderScreen = () => {
    switch (screen) {
      case Screen.MENU:
        return (
          <MainMenu 
            onNewGame={() => loadLevel(0)}
            onSelectLevel={() => setScreen(Screen.LEVEL_SELECT)}
            onInstructions={() => setScreen(Screen.INSTRUCTIONS)}
          />
        );
      
      case Screen.LEVEL_SELECT:
        return (
          <LevelSelect 
            levels={LEVELS}
            progress={progress}
            onSelect={loadLevel}
            onBack={() => setScreen(Screen.MENU)}
          />
        );

      case Screen.INSTRUCTIONS:
        return (
          <Instructions onBack={() => setScreen(Screen.MENU)} />
        );

      case Screen.GAME:
        if (!gameState) return <div>Loading...</div>;
        const currentLevel = LEVELS[currentLevelIndex];
        
        return (
          <div className="relative w-full h-full flex flex-col lg:flex-row items-center justify-center p-4 gap-8 animate-fade-in">
            {/* Back Button overlay for Game */}
            <button 
              onClick={() => setScreen(Screen.MENU)} 
              className="absolute top-4 left-4 text-gray-400 hover:text-white z-50 flex items-center gap-2 bg-gray-800/80 px-3 py-2 rounded-full text-sm"
            >
              &larr; Menu
            </button>

            <GameControls
              levelId={currentLevel.id}
              moves={gameState.moves}
              pushes={gameState.pushes}
              parMoves={currentLevel.parMoves}
              parPushes={currentLevel.parPushes}
              retryCount={retryCount}
              solution={currentLevel.solution}
              demoAvailable={!!currentLevel.demoMoves}
              isAutoSolving={isAutoSolving}
              totalLevels={LEVELS.length}
              onReset={restartLevel}
              onMove={handleMove}
              onNextLevel={() => loadLevel(currentLevelIndex + 1)}
              onPrevLevel={() => loadLevel(currentLevelIndex - 1)}
              onAutoSolve={startAutoSolve}
            />

            <BoardRenderer grid={gameState.grid} playerPos={gameState.playerPos} />

            {gameState.levelComplete && (
              <WinModal
                stars={gameState.stars}
                moves={gameState.moves}
                pushes={gameState.pushes}
                hasNextLevel={currentLevelIndex < LEVELS.length - 1}
                onNext={() => loadLevel(currentLevelIndex + 1)}
                onReplay={restartLevel}
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
      {renderScreen()}
      
      {screen === Screen.MENU && (
         <div className="absolute bottom-2 right-4 text-gray-700 text-xs hidden lg:block">
          Game Engine Ready for Kotlin Migration
        </div>
      )}
    </div>
  );
}

export default App;