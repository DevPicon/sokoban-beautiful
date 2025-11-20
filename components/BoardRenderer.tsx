import React, { useMemo } from 'react';
import { EntityType, Position } from '../types';

interface BoardRendererProps {
  grid: EntityType[][];
  playerPos: Position;
}

export const BoardRenderer: React.FC<BoardRendererProps> = ({ grid, playerPos }) => {
  const height = grid.length;
  const width = grid[0]?.length || 0;

  // Memoize the static grid structure so it doesn't re-render unnecessarily
  const staticGrid = useMemo(() => {
    return grid.map((row, y) =>
      row.map((cell, x) => {
        // Logic to determine what is "Static"
        // Walls, Floors, and Spots are static.
        // Boxes are dynamic but currently snap to grid.
        let type = cell;
        
        // If it's the player, we render the floor underneath in the grid
        if (cell === EntityType.PLAYER) type = EntityType.FLOOR;
        if (cell === EntityType.PLAYER_ON_SPOT) type = EntityType.SPOT;
        
        // We render Boxes in the grid for now to handle z-indexing simply, 
        // though for complex animation they would be overlays. 
        // But we want the Player to float OVER them.
        
        return <Tile key={`${x}-${y}`} type={type} />;
      })
    );
  }, [grid]);

  return (
    <div className="bg-gray-900 p-2 rounded-lg shadow-2xl overflow-hidden relative max-w-[95vw] max-h-[60vh] md:max-h-[70vh]">
      <div className="relative">
        {/* STATIC LAYER & BOXES */}
        <div
          className="grid gap-0 border-4 border-gray-700"
          style={{
            gridTemplateColumns: `repeat(${width}, minmax(20px, 40px))`,
          }}
        >
          {staticGrid}
        </div>

        {/* PLAYER OVERLAY LAYER */}
        {/* We use percentage positioning to map 0..width to 0..100% */}
        <div 
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
             // The container covers the whole grid. 
             // We need to position the player within a cell size.
          }}
        >
          <div
            className="absolute transition-all duration-150 ease-out z-20"
            style={{
              // Calculate percentage position
              left: `${(playerPos.x / width) * 100}%`,
              top: `${(playerPos.y / height) * 100}%`,
              width: `${100 / width}%`,
              height: `${100 / height}%`,
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
               <div className="w-3/4 h-3/4 bg-player rounded-full border-2 border-blue-900 shadow-lg relative">
                  <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full opacity-50"></div>
                  {/* Eyes */}
                  <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-black rounded-full opacity-80"></div>
                  <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-black rounded-full opacity-80"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TileProps {
  type: EntityType;
}

const Tile: React.FC<TileProps> = React.memo(({ type }) => {
  let baseClass = "w-full aspect-square relative ";
  let content = null;

  switch (type) {
    case EntityType.WALL:
      baseClass += "bg-wall shadow-inner border-t border-l border-gray-600";
      break;
    case EntityType.FLOOR:
      baseClass += "bg-floor";
      break;
    case EntityType.SPOT:
      baseClass += "bg-floor flex items-center justify-center";
      content = <div className="w-1/3 h-1/3 bg-spot rounded-full shadow-sm" />;
      break;
    case EntityType.BOX:
      baseClass += "bg-floor flex items-center justify-center";
      content = (
        <div className="w-4/5 h-4/5 bg-box border-4 border-amber-700 shadow-md flex items-center justify-center transition-transform duration-200">
           <div className="w-full border-t border-amber-800/50 opacity-50 mt-1"></div>
           <div className="absolute w-full border-b border-amber-800/50 opacity-50 mb-1"></div>
        </div>
      );
      break;
    case EntityType.BOX_ON_SPOT:
      baseClass += "bg-floor flex items-center justify-center";
      content = (
        <div className="w-4/5 h-4/5 bg-box-on-spot border-4 border-emerald-800 shadow-[0_0_15px_rgba(16,185,129,0.6)] flex items-center justify-center animate-pulse">
          <div className="text-white font-bold opacity-80">✓</div>
        </div>
      );
      break;
    // Player is now handled in Overlay, but we keep these cases for 'base' rendering if needed or legacy
    case EntityType.PLAYER: 
    case EntityType.PLAYER_ON_SPOT:
      // Should technically render floor/spot under the player overlay
      baseClass += "bg-floor flex items-center justify-center";
      if (type === EntityType.PLAYER_ON_SPOT) {
        content = <div className="w-1/3 h-1/3 bg-spot rounded-full shadow-sm" />;
      }
      break;
    case EntityType.VOID:
      baseClass += "bg-transparent";
      break;
  }

  return <div className={baseClass}>{content}</div>;
});