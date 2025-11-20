import React from 'react';
import { LevelConfig, LevelCompletion } from '../types';

interface LevelSelectProps {
  levels: LevelConfig[];
  progress: LevelCompletion[];
  onSelect: (levelIndex: number) => void;
  onBack: () => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({ levels, progress, onSelect, onBack }) => {
  const getStars = (levelId: number) => {
    return progress.find(p => p.levelId === levelId)?.stars || 0;
  };

  return (
    <div className="flex flex-col w-full h-full max-w-4xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          &larr; Back
        </button>
        <h2 className="text-3xl font-bold text-white">Select Level</h2>
        <div className="w-16"></div> {/* Spacer for centering */}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pb-4">
        {levels.map((level, index) => {
          const stars = getStars(level.id);
          const isLocked = index > 0 && getStars(levels[index - 1].id) === 0;

          return (
            <button
              key={level.id}
              onClick={() => !isLocked && onSelect(index)}
              disabled={isLocked}
              className={`
                relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300
                ${isLocked 
                  ? 'bg-gray-800/50 border-gray-800 text-gray-600 cursor-not-allowed' 
                  : 'bg-gray-800 border-gray-700 hover:border-blue-500 hover:bg-gray-750 hover:-translate-y-1 hover:shadow-xl cursor-pointer group'
                }
              `}
            >
              <span className={`text-4xl font-black mb-2 ${isLocked ? 'text-gray-700' : 'text-gray-500 group-hover:text-white'}`}>
                {level.id}
              </span>
              
              {isLocked ? (
                <div className="text-xs uppercase font-bold tracking-wider">Locked</div>
              ) : (
                <>
                  <div className="flex gap-1 h-6">
                    {[1, 2, 3].map(star => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={star <= stars ? "#fbbf24" : "#374151"}
                        className={`w-5 h-5 ${star <= stars ? 'drop-shadow-md' : ''}`}
                      >
                         <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-gray-500 flex flex-col items-center gap-1">
                     <span>Par Moves: {level.parMoves}</span>
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};