// game.js — Twin Lanterns game logic: two panels, one truth.
// Click (or the keyboard reticle) on a difference marks it on both pictures,
// updates the counter, and keeps score. Wrong clicks cost a heart and five
// seconds. Hints, timer, combo, levels and the win/fail overlays live here.

import { SCENES, SCENE_W, SCENE_H } from './scenes.js';
import { LEVELS } from './levels.js';
import { SoundFX } from './audio.js';

const $ = (id) => document.getElementById(id);

export class Game {
  constructor() {
    this.sfx = new SoundFX();
    this.levelIndex = 0;
    this.found = new Set();
    this.hearts = 3;
    this.hints = 3;
    this.score = 0;
    this.combo = 0;
    this.timeLeft = 0;
    this.timerId = null;
    this.playing = false;
    this.shotMode = false;
    this.reticle = { panel: 'left', x: SCENE_W / 2, y: SCENE_H / 2 };
    this.best = this.loadBest();
    this.bindUI();
    this.buildMenu();
  }

  get level() { return LEVELS[this.levelIndex]; }
  get remaining() { return this.level.differences.length - this.found.size; }

  loadBest() {
    try { return JSON.parse(localStorage.getItem('twin-lanterns-best') || '{}'); } catch { return {}; }
  }
  saveBest() {
    try { localStorage.setItem('twin-lanterns-best', JSON.stringify(this.best)); } catch { /* private mode */ }
  }

  // ---------------------------------------------------------- setup ---
  bindUI() {
    const left = $('canvas-left'), right = $('canvas-right');
    left.addEventListener('click', (e) => this.onPanelClick(e, 'left'));
    right.addEventListener('click', (e) => this.onPanelClick(e, 'right'));
    $('hint-btn').addEventListener('click', () => this.useHint());
    $('mute-btn').addEventListener('click', () => {
      const on = this.sfx.toggle();
      $('mute-btn').textContent = on ? '🔊' : '🔇';
    });
    $('menu-btn').addEventListener('click', () => this.showMenu());
    $('replay-btn').addEventListener('click', () => this.startLevel(this.levelIndex));
    $('next-btn').addEventListener('click', () => this.nextLevel());
    $('end-menu-btn').addEventListener('click', () => this.showMenu());
    document.addEventListener('keydown', (e) => this.onKey(e));
    [left, right].forEach((c) => c.addEventListener('mousemove', (e) => this.hideReticle()));
  }

  buildMenu() {
    const wrap = $('level-cards');
    wrap.innerHTML = '';
    LEVELS.forEach((lv, i) => {
      const card = document.createElement('div');
      card.className = 'level-card';
      card.tabIndex = 0;
      const best = this.best[lv.id];
      card.innerHTML = `<h3>${i + 1}. ${lv.name}</h3><p>${lv.blurb}</p>` +
        (best ? `<div class="best">Best: ${best} pts</div>` : '');
      card.addEventListener('click', () => this.startLevel(i));
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.startLevel(i); });
      wrap.appendChild(card);
    });
  }

  // -------------------------------------------------------- playing ---
  startLevel(i) {
    this.levelIndex = i;
    this.found = new Set();
    this.hearts = 3;
    this.hints = 3;
    this.combo = 0;
    this.timeLeft = this.level.timeLimit;
    this.playing = true;
    $('menu-overlay').hidden = true;
    $('end-overlay').hidden = true;
    $('markers-left').innerHTML = '';
    $('markers-right').innerHTML = '';
    $('level-name').textContent = `Level ${i + 1} · ${this.level.name}`;
    $('total-count').textContent = this.level.differences.length;
    $('hint-btn').disabled = false;
    this.drawPanels();
    this.updateHUD();
    this.startTimer();
    this.showToast(`Level ${i + 1}: find ${this.level.differences.length} differences!`);
  }

  drawPanels() {
    const draw = SCENES[this.level.scene];
    draw($('canvas-left').getContext('2d'), new Set());
    draw($('canvas-right').getContext('2d'), new Set(this.level.differences.map((d) => d.id)));
  }

  startTimer() {
    clearInterval(this.timerId);
    if (this.shotMode) return;
    this.timerId = setInterval(() => {
      if (!this.playing) return;
      this.timeLeft = Math.max(0, this.timeLeft - 0.25);
      this.updateTimer();
      if (this.timeLeft <= 0) this.endLevel(false, 'The lantern burned down — time ran out!');
    }, 250);
  }

  // --------------------------------------------------------- input ---
  scenePoint(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * SCENE_W,
      y: ((event.clientY - rect.top) / rect.height) * SCENE_H,
    };
  }

  onPanelClick(event, side) {
    if (!this.playing) return;
    this.sfx.ensure();
    const canvas = side === 'left' ? $('canvas-left') : $('canvas-right');
    const p = this.scenePoint(canvas, event);
    this.tryMark(p.x, p.y, side, event.clientX, event.clientY);
  }

  tryMark(x, y, side, clientX, clientY) {
    const diff = this.level.differences.find((d) => {
      if (this.found.has(d.id)) return false;
      const hx = side === 'right' && d.x2 !== undefined ? d.x2 : d.x;
      const hy = side === 'right' && d.y2 !== undefined ? d.y2 : d.y;
      return Math.hypot(x - hx, y - hy) <= d.r;
    });
    if (diff) this.markFound(diff);
    else this.markMiss(x, y, side, clientX, clientY);
  }

  markFound(diff, silent = false) {
    this.found.add(diff.id);
    this.combo += 1;
    const gained = 100 + (this.combo - 1) * 25;
    this.score += gained;
    this.placeMarker(diff, 'left');
    this.placeMarker(diff, 'right');
    if (!silent) {
      this.sfx.found();
      this.showToast(`✓ ${diff.name}  (+${gained})`);
    }
    this.updateHUD();
    if (this.found.size === this.level.differences.length) {
      const bonus = Math.round(this.timeLeft) * 5;
      this.score += bonus;
      this.updateHUD();
      this.endLevel(true, `All ${this.level.differences.length} differences found — time bonus +${bonus}!`);
    }
  }

  markMiss(x, y, side, clientX, clientY) {
    this.combo = 0;
    this.hearts -= 1;
    this.timeLeft = Math.max(0, this.timeLeft - 5);
    this.sfx.miss();
    const layer = side === 'left' ? $('markers-left') : $('markers-right');
    const miss = document.createElement('div');
    miss.className = 'miss-mark';
    miss.textContent = '✕';
    miss.style.left = `${(x / SCENE_W) * 100}%`;
    miss.style.top = `${(y / SCENE_H) * 100}%`;
    layer.appendChild(miss);
    setTimeout(() => miss.remove(), 750);
    const panel = $(side === 'left' ? 'panel-left' : 'panel-right');
    panel.classList.remove('shake');
    void panel.offsetWidth;
    panel.classList.add('shake');
    this.showToast('Not a difference — a heart and 5 seconds lost!');
    this.updateHUD();
    if (this.hearts <= 0) this.endLevel(false, 'Three wrong clicks — the lanterns dimmed out!');
  }

  placeMarker(diff, side) {
    const layer = side === 'left' ? $('markers-left') : $('markers-right');
    const m = document.createElement('div');
    m.className = 'marker';
    const hx = side === 'right' && diff.x2 !== undefined ? diff.x2 : diff.x;
    const hy = side === 'right' && diff.y2 !== undefined ? diff.y2 : diff.y;
    m.style.left = `${(hx / SCENE_W) * 100}%`;
    m.style.top = `${(hy / SCENE_H) * 100}%`;
    layer.appendChild(m);
  }

  useHint() {
    if (!this.playing || this.hints <= 0) return;
    const left = this.level.differences.filter((d) => !this.found.has(d.id));
    if (!left.length) return;
    this.hints -= 1;
    this.score = Math.max(0, this.score - 50);
    this.sfx.hint();
    const diff = left[Math.floor(Math.random() * left.length)];
    ['left', 'right'].forEach((side) => {
      const layer = side === 'left' ? $('markers-left') : $('markers-right');
      const m = document.createElement('div');
      m.className = 'marker hint-pulse';
      const hx = side === 'right' && diff.x2 !== undefined ? diff.x2 : diff.x;
      const hy = side === 'right' && diff.y2 !== undefined ? diff.y2 : diff.y;
      m.style.left = `${(hx / SCENE_W) * 100}%`;
      m.style.top = `${(hy / SCENE_H) * 100}%`;
      layer.appendChild(m);
      setTimeout(() => m.remove(), 2100);
    });
    this.showToast('💡 Hint: look near the glowing ring (−50 pts)');
    this.updateHUD();
  }

  // ------------------------------------------------------ keyboard ---
  onKey(e) {
    if (!$('menu-overlay').hidden) {
      if (e.key >= '1' && e.key <= '3') this.startLevel(Number(e.key) - 1);
      return;
    }
    if (!$('end-overlay').hidden) {
      if (e.key === 'r' || e.key === 'R') this.startLevel(this.levelIndex);
      else if (e.key === 'n' || e.key === 'N') this.nextLevel();
      else if (e.key === 'Escape') this.showMenu();
      return;
    }
    const step = e.shiftKey ? 8 : 24;
    const r = this.reticle;
    if (e.key === 'Tab') { r.panel = r.panel === 'left' ? 'right' : 'left'; e.preventDefault(); this.showReticle(); return; }
    if (e.key === 'ArrowLeft') { r.x = Math.max(0, r.x - step); this.showReticle(); e.preventDefault(); return; }
    if (e.key === 'ArrowRight') { r.x = Math.min(SCENE_W, r.x + step); this.showReticle(); e.preventDefault(); return; }
    if (e.key === 'ArrowUp') { r.y = Math.max(0, r.y - step); this.showReticle(); e.preventDefault(); return; }
    if (e.key === 'ArrowDown') { r.y = Math.min(SCENE_H, r.y + step); this.showReticle(); e.preventDefault(); return; }
    if (e.key === 'Enter' || e.key === ' ') {
      if (this.playing) { this.sfx.ensure(); this.tryMark(r.x, r.y, r.panel); }
      e.preventDefault(); return;
    }
    if (e.key === 'h' || e.key === 'H') { this.useHint(); return; }
    if (e.key === 'r' || e.key === 'R') { this.startLevel(this.levelIndex); return; }
    if (e.key === 'm' || e.key === 'M') { const on = this.sfx.toggle(); $('mute-btn').textContent = on ? '🔊' : '🔇'; return; }
    if (e.key >= '1' && e.key <= '3') { this.startLevel(Number(e.key) - 1); return; }
    if (e.key === 'Escape') { this.showMenu(); }
  }

  showReticle() {
    const ch = $('crosshair');
    const panel = this.reticle.panel === 'left' ? $('panel-left') : $('panel-right');
    const rect = panel.getBoundingClientRect();
    const stage = $('stage').getBoundingClientRect();
    const canvasRect = $(this.reticle.panel === 'left' ? 'canvas-left' : 'canvas-right').getBoundingClientRect();
    ch.hidden = false;
    ch.style.left = `${canvasRect.left - stage.left + (this.reticle.x / SCENE_W) * canvasRect.width}px`;
    ch.style.top = `${canvasRect.top - stage.top + (this.reticle.y / SCENE_H) * canvasRect.height}px`;
    void rect;
  }
  hideReticle() { $('crosshair').hidden = true; }

  // ----------------------------------------------------------- HUD ---
  updateHUD() {
    $('found-count').textContent = this.found.size;
    $('remaining').textContent = `${this.remaining} remaining`;
    $('score-value').textContent = this.score;
    $('combo').textContent = `Combo ×${Math.max(1, this.combo)}`;
    $('hints-left').textContent = this.hints;
    $('hint-btn').disabled = this.hints <= 0 || !this.playing;
    $('hearts').innerHTML =
      '❤'.repeat(Math.max(0, this.hearts)) +
      '<span class="lost">' + '❤'.repeat(Math.max(0, 3 - this.hearts)) + '</span>';
    this.updateTimer();
  }

  updateTimer() {
    const t = Math.ceil(this.timeLeft);
    $('timer-text').textContent = `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
    const bar = $('timer-bar');
    bar.style.width = `${(this.timeLeft / this.level.timeLimit) * 100}%`;
    bar.classList.toggle('low', this.timeLeft < 30);
  }

  showToast(msg) {
    const toast = $('toast');
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(this.toastId);
    this.toastId = setTimeout(() => { toast.hidden = true; }, 2200);
  }

  // -------------------------------------------------------- ending ---
  endLevel(won, detail) {
    this.playing = false;
    clearInterval(this.timerId);
    if (won) {
      this.sfx.win();
      const stars = this.hearts === 3 && this.hints === 3 ? 3 : this.hearts >= 1 ? 2 : 1;
      $('end-title').textContent = '🎉 Level Complete!';
      $('end-stars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
      const prev = this.best[this.level.id] || 0;
      if (this.score > prev) { this.best[this.level.id] = this.score; this.saveBest(); this.buildMenu(); }
      $('next-btn').style.display = this.levelIndex < LEVELS.length - 1 ? '' : 'none';
    } else {
      this.sfx.lose();
      $('end-title').textContent = '🕯️ Level Failed';
      $('end-stars').textContent = '☆☆☆';
      $('next-btn').style.display = 'none';
    }
    $('end-detail').textContent = `${detail} Score: ${this.score}.`;
    $('end-overlay').hidden = false;
  }

  nextLevel() {
    if (this.levelIndex < LEVELS.length - 1) this.startLevel(this.levelIndex + 1);
    else this.showMenu();
  }

  showMenu() {
    this.playing = false;
    clearInterval(this.timerId);
    this.buildMenu();
    $('end-overlay').hidden = true;
    $('menu-overlay').hidden = false;
  }

  // ---------------------------------------------------- screenshot ---
  // Deterministic staged states for screenshots: ?shot=cover|market|garden|win
  // &found=0,1,2 marks those differences (by index) before the shot.
  applyShotMode() {
    const q = new URLSearchParams(location.search);
    const shot = q.get('shot');
    if (!shot) return false;
    this.shotMode = true;
    const map = { cover: 0, win: 0, market: 1, garden: 2 };
    const level = map[shot] ?? 0;
    const foundIdx = (q.get('found') || '').split(',').filter((s) => s !== '').map(Number);
    this.startLevel(level);
    foundIdx.forEach((i) => {
      const d = this.level.differences[i];
      if (d) this.markFound(d, true);
    });
    $('toast').hidden = true;
    if (shot === 'win') {
      this.level.differences.forEach((d) => { if (!this.found.has(d.id)) this.markFound(d, true); });
      $('toast').hidden = true;
      $('end-overlay').hidden = true; // keep the twin panels visible; overlay would hide them
      this.playing = true; // win shot shows the completed board, not the overlay
    }
    window.__shotReady = true;
    return true;
  }
}
