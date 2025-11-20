import React from 'react';

interface MainMenuProps {
  onNewGame: () => void;
  onSelectLevel: () => void;
  onInstructions: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onNewGame, onSelectLevel, onInstructions }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full animate-fade-in space-y-10">
      {/* Hero Section */}
      <div className="text-center relative">
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600 drop-shadow-lg transform hover:scale-105 transition-transform duration-500">
          SOKOBAN
        </h1>
        <h2 className="text-xl text-gray-400 tracking-[0.5em] mt-4 uppercase">Warehouse Master</h2>
      </div>

      {/* Menu Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs z-10">
        <MenuButton onClick={onNewGame} primary>
          New Game
        </MenuButton>
        <MenuButton onClick={onSelectLevel}>
          Select Level
        </MenuButton>
        <MenuButton onClick={onInstructions}>
          Instructions
        </MenuButton>
      </div>

      {/* Decorative Footer */}
      <div className="absolute bottom-8 text-gray-600 text-sm">
        <div className="flex gap-4">
          <div className="w-4 h-4 bg-wall rounded-sm"></div>
          <div className="w-4 h-4 bg-box rounded-sm rotate-12"></div>
          <div className="w-4 h-4 bg-spot rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

const MenuButton: React.FC<{ onClick: () => void; children: React.ReactNode; primary?: boolean }> = ({ onClick, children, primary }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden group w-full py-4 px-6 rounded-xl font-bold text-lg tracking-wide transition-all duration-300 shadow-lg
        ${primary 
          ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/50 hover:shadow-blue-500/50 hover:-translate-y-1' 
          : 'bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white border border-gray-700 hover:border-gray-500'
        }
      `}
    >
      <span className="relative z-10">{children}</span>
      {primary && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>}
    </button>
  );
};