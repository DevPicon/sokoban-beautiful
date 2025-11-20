import React from 'react';

interface WinModalProps {
  stars: number;
  moves: number;
  pushes: number;
  onNext: () => void;
  onReplay: () => void;
  hasNextLevel: boolean;
}

export const WinModal: React.FC<WinModalProps> = ({ stars, moves, pushes, onNext, onReplay, hasNextLevel }) => {
  const renderStars = () => {
    const starIcons = [];
    for (let i = 1; i <= 3; i++) {
      starIcons.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={i <= stars ? "#fbbf24" : "#4b5563"}
          className={`w-12 h-12 ${i <= stars ? 'drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]' : ''} transition-all duration-500`}
        >
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
      );
    }
    return starIcons;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-gray-800 border-2 border-yellow-500 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl transform scale-100 animate-pop-in">
        <h2 className="text-3xl font-bold text-white mb-2">Level Complete!</h2>
        
        <div className="flex justify-center gap-2 my-6">
          {renderStars()}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-gray-300">
          <div className="bg-gray-700 p-2 rounded">
            <div className="text-xs uppercase tracking-wide">Moves</div>
            <div className="text-xl font-mono text-white">{moves}</div>
          </div>
          <div className="bg-gray-700 p-2 rounded">
            <div className="text-xs uppercase tracking-wide">Pushes</div>
            <div className="text-xl font-mono text-white">{pushes}</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {hasNextLevel ? (
            <button
              onClick={onNext}
              className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg transition-transform active:scale-95"
            >
              Next Level
            </button>
          ) : (
            <div className="text-yellow-400 font-bold py-2">All Levels Completed!</div>
          )}
          
          <button
            onClick={onReplay}
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
          >
            Replay Level
          </button>
        </div>
      </div>
    </div>
  );
};