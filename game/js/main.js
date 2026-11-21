// main.js — Twin Lanterns bootstrap. Builds the game, shows the menu, and
// honours ?shot=… staged states for screenshots (see game.js applyShotMode).

import { Game } from './game.js';

const game = new Game();
if (!game.applyShotMode()) {
  game.showMenu();
}
