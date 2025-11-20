import { LevelConfig } from './types';

// Legend:
// # : Wall
//   : Floor
// . : Spot
// $ : Box
// @ : Player
// * : Box on Spot

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    parMoves: 20,
    parPushes: 6,
    solution: "1. Move Up, Right, then push Down.\n2. Move Down, Right, Up, Left to get behind the middle box.\n3. Push the middle box Right.\n4. Navigate to push the bottom box Down.\n5. Push the top box Up.",
    // A sample valid solution string for the engine to replay
    demoMoves: "urddrruulldlldrruurrdLrullddrd", 
    map: [
      "  ##### ",
      "###   # ",
      "#.@$  # ",
      "### $.# ",
      "#.##$ # ",
      "# # . ##",
      "#$ *$$.#",
      "#   .  #",
      "########"
    ]
  },
  {
    id: 2,
    parMoves: 40,
    parPushes: 12,
    solution: "The key is not to block the corridor. Push the first box only slightly, then move around to push the second box all the way to the bottom spot first.",
    map: [
      "#####",
      "#@  #",
      "# $$#",
      "##  #",
      "## .#",
      "## .#",
      "#####"
    ]
  },
  {
    id: 3,
    parMoves: 55,
    parPushes: 16,
    solution: "This level requires careful staging. Move the rightmost box out of the corner first. Don't put any box into a spot until you have a clear path for the others.",
    map: [
      "  ####  ",
      "###  ####",
      "#     $ #",
      "# #  #$ #",
      "# . .#@ #",
      "#########"
    ]
  },
  {
    id: 4,
    parMoves: 30,
    parPushes: 8,
    solution: "Focus on the central box first. Push it up, then handle the side boxes. Ensure you don't trap yourself between the wall and a box.",
    map: [
      "#######",
      "#     #",
      "# .$. #",
      "#  @  #",
      "# .$. #",
      "#     #",
      "#######"
    ]
  },
  {
    id: 5,
    parMoves: 60,
    parPushes: 20,
    solution: "Work from the inside out. Place the innermost boxes first, but be careful not to block the path to the outer spots.",
    map: [
      "#######",
      "#     #",
      "# .$. #",
      "# $.$ #",
      "# .@. #",
      "# $.$ #",
      "# .$. #",
      "#     #",
      "#######"
    ]
  }
];