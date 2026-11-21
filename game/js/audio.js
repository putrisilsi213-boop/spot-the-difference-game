// audio.js — all sounds are synthesized with WebAudio. No audio files,
// no network, nothing to load. A tiny synth: pleasant chimes for a find,
// a low buzz for a miss, a little arpeggio for a win.

export class SoundFX {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }
  ensure() {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { this.ctx = null; }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }
  tone(freq, at, dur, type = 'sine', vol = 0.16) {
    const ac = this.ensure();
    if (!ac || !this.enabled) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ac.currentTime + at);
    gain.gain.linearRampToValueAtTime(vol, ac.currentTime + at + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + at + dur);
    osc.connect(gain).connect(ac.destination);
    osc.start(ac.currentTime + at);
    osc.stop(ac.currentTime + at + dur + 0.05);
  }
  found() { this.tone(660, 0, 0.18); this.tone(990, 0.09, 0.28); }
  miss() { this.tone(140, 0, 0.22, 'sawtooth', 0.1); }
  hint() { this.tone(520, 0, 0.12, 'triangle'); this.tone(780, 0.08, 0.14, 'triangle'); }
  click() { this.tone(440, 0, 0.06, 'triangle', 0.08); }
  win() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, i * 0.11, 0.3)); }
  lose() { [330, 262, 196].forEach((f, i) => this.tone(f, i * 0.14, 0.25, 'triangle', 0.12)); }
  toggle() { this.enabled = !this.enabled; return this.enabled; }
}
