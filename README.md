# spot-the-difference-game

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/putrisilsi213-boop/spot-the-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/putrisilsi213-boop/spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

A make.fun entry for **best-spot-the-difference-game-20261121-0451**: the best
spot-the-difference game — original, complete, and fully offline.

## The game

Two near-identical pictures sit side by side. They look the same. They are not.
Find every hidden difference before the lantern burns down.

**Three hand-drawn worlds** (every pixel drawn in code on `<canvas>` — no image
files, no network requests, no libraries):

1. **The Clockmaker's Attic** — 7 differences, 2:00 on the clock
2. **Night Market Stall** — 8 differences, 2:30 on the clock
3. **Moonlit Garden** — 9 differences, 3:00 on the clock

**How it plays**

- **Mouse:** click a difference on either picture — it is circled on both.
- **Keyboard:** arrow keys move the reticle, `Tab` switches picture, `Enter`/`Space`
  marks, `H` asks for a hint, `R` restarts, `1–3` picks a level, `M` mutes, `Esc` menu.
- **Rules:** a wrong click costs a heart and 5 seconds (3 hearts per level).
  Hints highlight one unfound difference for 2 seconds (−50 pts, 3 per level).
  Finds build a combo bonus; finishing fast earns a time bonus; 1–3 stars per level.
- **Feedback:** green ring + check on every find, a red ✕ and screen shake on a
  miss, a burning-down timer bar, and synthesized WebAudio chimes (no audio files).
- Best scores per level are kept in `localStorage`.

## Play it

```sh
node serve.ts        # then open http://localhost:8080
```

or serve `game/` with any static server and open `game/index.html`. Requires
Node.js 22.18+ for the hand-in program only; the game itself is plain static files.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `game/` and `screenshots/` to the output dir and writes
`dossier.json` with the vendored `vendor/makefun-game.ts` library.

## Layout

```
main.ts                  hand-in program (Node 22, stdlib only)
vendor/makefun-game.ts   make.fun dossier library, kit copy unchanged
game/
  index.html             page shell: HUD, twin panels, menu + end overlays
  css/style.css          lantern palette, markers, overlays
  js/main.js             bootstrap
  js/game.js             rules, input, HUD, timer, hints, scoring
  js/levels.js           the 3 levels and every difference's hotspot
  js/scenes.js           the three worlds, drawn procedurally on canvas
  js/audio.js            synthesized WebAudio sounds
screenshots/             real browser renders of the game
```

## Originality

All art, names, sounds and levels are original, drawn and synthesized in code for
this entry. No assets are copied from any commercial game.

---

<sub>Entered on [make.fun](https://make.fun/?ref=d6m6thj3&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
