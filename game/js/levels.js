// levels.js — the three worlds of Twin Lanterns and where they differ.
// Each difference: an id (matched by the scene painter), a name shown when it
// is found, and one hotspot per panel in scene coordinates (600x440). Most
// differences sit in the same spot on both panels; a moved object (the
// butterfly) has a different hotspot on each side.

export const LEVELS = [
  {
    id: 'attic',
    name: "The Clockmaker's Attic",
    blurb: 'Gears, books and one sleepy cat. 7 differences hide among the ticking.',
    timeLimit: 120,
    scene: 'attic',
    differences: [
      { id: 'bird', name: 'The cuckoo bird flew away', x: 117, y: 76, r: 26 },
      { id: 'hands', name: 'The clock shows a different time', x: 117, y: 152, r: 42 },
      { id: 'bowtie', name: "The cat's bowtie changed colour", x: 214, y: 390, r: 20 },
      { id: 'book', name: 'An extra red book on the shelf', x: 529, y: 173, r: 22 },
      { id: 'moon', name: 'The moon went from crescent to full', x: 498, y: 76, r: 26 },
      { id: 'steam', name: 'The teapot stopped steaming', x: 384, y: 242, r: 24 },
      { id: 'rug', name: 'The rug lost its golden diamond', x: 300, y: 402, r: 24 },
    ],
  },
  {
    id: 'market',
    name: 'Night Market Stall',
    blurb: 'Lanterns, dumplings and a cat on guard. 8 differences in the crowd.',
    timeLimit: 150,
    scene: 'market',
    differences: [
      { id: 'lantern', name: 'A lantern turned green', x: 150, y: 148, r: 24 },
      { id: 'orange', name: 'An orange went missing', x: 188, y: 264, r: 26 },
      { id: 'sign', name: 'The sign now says KOPI', x: 300, y: 180, r: 30 },
      { id: 'cat', name: 'The stall cat vanished', x: 543, y: 318, r: 26 },
      { id: 'awning', name: 'An awning stripe turned blue', x: 190, y: 89, r: 22 },
      { id: 'coins', name: 'Two coins disappeared', x: 252, y: 308, r: 20 },
      { id: 'steam', name: 'The steamer stopped steaming', x: 424, y: 240, r: 24 },
      { id: 'flag', name: 'A bunting flag changed colour', x: 474, y: 48, r: 18 },
    ],
  },
  {
    id: 'garden',
    name: 'Moonlit Garden',
    blurb: 'Fireflies, frogs and one restless butterfly. 9 differences after dark.',
    timeLimit: 180,
    scene: 'garden',
    differences: [
      { id: 'fireflies', name: 'A cluster of fireflies blinked out', x: 348, y: 154, r: 26 },
      { id: 'flower', name: 'A pink bloom turned yellow', x: 200, y: 368, r: 22 },
      { id: 'frog', name: 'The frog hopped off its lily pad', x: 330, y: 362, r: 24 },
      { id: 'butterfly', name: 'The butterfly moved flowers', x: 252, y: 178, r: 30, x2: 386, y2: 196 },
      { id: 'spots', name: 'The mushroom lost two spots', x: 92, y: 322, r: 24 },
      { id: 'ripples', name: 'The pond ripples are gone', x: 420, y: 392, r: 26 },
      { id: 'star', name: 'A star fell out of the sky', x: 140, y: 70, r: 18 },
      { id: 'lantern', name: 'The stone lantern went dark', x: 521, y: 318, r: 26 },
      { id: 'snail', name: 'The snail slid away', x: 146, y: 394, r: 22 },
    ],
  },
];
