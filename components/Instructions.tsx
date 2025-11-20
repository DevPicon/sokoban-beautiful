import React from 'react';

interface InstructionsProps {
  onBack: () => void;
}

export const Instructions: React.FC<InstructionsProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col w-full max-w-2xl p-6 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 animate-fade-in">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-white">How to Play</h2>
        <button onClick={onBack} className="text-gray-400 hover:text-white">✕ Close</button>
      </div>

      <div className="space-y-6 text-gray-300 overflow-y-auto max-h-[60vh] pr-2">
        <p className="text-lg">
          Welcome to <span className="text-blue-400 font-bold">Sokoban</span>.
        </p>

        {/* Visual Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 select-none">
            <div className="flex flex-col items-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                <div className="w-10 h-10 bg-player rounded-full border-2 border-blue-900 mb-2 relative shadow-lg">
                   <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-white rounded-full opacity-50"></div>
                   <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-black rounded-full opacity-80"></div>
                   <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-black rounded-full opacity-80"></div>
                </div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Player (You)</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                <div className="w-10 h-10 bg-box border-2 border-amber-700 mb-2 flex items-center justify-center shadow-md">
                  <div className="w-full border-t border-amber-800/50 opacity-50"></div>
                </div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Box</span>
            </div>
             <div className="flex flex-col items-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                <div className="w-10 h-10 bg-floor flex items-center justify-center mb-2 border border-gray-700/50">
                    <div className="w-4 h-4 bg-spot rounded-full shadow-sm"></div>
                </div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Target Spot</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                <div className="w-10 h-10 bg-box-on-spot border-2 border-emerald-800 flex items-center justify-center mb-2 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                    <div className="text-white text-sm font-bold">✓</div>
                </div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Completed</span>
            </div>
        </div>

        <p>
             Your goal is to push all the <span className="text-amber-500 font-bold">Boxes</span> onto the <span className="text-red-400 font-bold">Target Spots</span>. When a box is placed correctly, it turns <span className="text-emerald-400 font-bold">Green</span>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <h3 className="text-white font-bold mb-2">Movement</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Use <strong>Arrow Keys</strong> or <strong>WASD</strong> to move.</li>
              <li>On mobile, use the on-screen D-Pad.</li>
              <li>You can only move <strong>one square</strong> at a time.</li>
            </ul>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
             <h3 className="text-white font-bold mb-2">Rules</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Walk into a box to <strong>push</strong> it.</li>
              <li>You can only push (never pull).</li>
              <li>You can only push <strong>one box</strong> at a time.</li>
              <li>Be careful not to push boxes into corners!</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <h3 className="text-white font-bold mb-2">Scoring</h3>
          <div className="flex items-center gap-4 justify-around text-sm">
             <div className="flex flex-col items-center">
               <div className="flex text-yellow-400">★</div>
               <span>Completed</span>
             </div>
             <div className="flex flex-col items-center">
               <div className="flex text-yellow-400">★★</div>
               <span>Good Effort</span>
             </div>
             <div className="flex flex-col items-center">
               <div className="flex text-yellow-400">★★★</div>
               <span>Efficient</span>
             </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-2">Score is calculated based on Moves and Pushes compared to the Par.</p>
        </div>
      </div>

      <button
        onClick={onBack}
        className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors shadow-lg"
      >
        Start Playing
      </button>
    </div>
  );
};