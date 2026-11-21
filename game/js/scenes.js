// scenes.js — every picture in Twin Lanterns is drawn fresh in code.
// Each scene function paints one 600x440 world. `mods` is the set of difference
// ids applied to this panel: the left panel gets none, the right panel gets all.
// Nothing is random at draw time, so both panels line up pixel for pixel
// except for the deliberate differences.

export const SCENE_W = 600;
export const SCENE_H = 440;

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function circle(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); }
function ellipse(ctx, x, y, rx, ry) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); }
function star(ctx, x, y, r, points = 5) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (i * Math.PI) / points - Math.PI / 2;
    const px = x + Math.cos(a) * rad, py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
}
function poly(ctx, pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
}
function text(ctx, s, x, y, size, color, align = 'center', weight = 'bold') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px "Segoe UI", Arial, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}

// ---------------------------------------------------------------- attic ---
export function drawAttic(ctx, mods) {
  // wooden wall + floor
  ctx.fillStyle = '#8a5a33'; ctx.fillRect(0, 0, 600, 440);
  ctx.fillStyle = '#7d4f2c';
  for (let y = 0; y < 350; y += 44) ctx.fillRect(0, y, 600, 3);
  ctx.fillStyle = '#6b4423';
  for (let x = 40; x < 600; x += 120) ctx.fillRect(x, 0, 2, 350);
  ctx.fillStyle = '#5d3a1e'; ctx.fillRect(0, 350, 600, 90);
  ctx.fillStyle = '#54331a';
  for (let x = 0; x < 600; x += 60) ctx.fillRect(x, 350, 2, 90);

  // window with night sky + moon (diff 5: crescent vs full)
  ctx.fillStyle = '#2c1e12'; rr(ctx, 424, 26, 148, 128, 8); ctx.fill();
  ctx.fillStyle = '#16233f'; ctx.fillRect(432, 34, 132, 112);
  ctx.fillStyle = '#ffe9a8';
  if (mods.has('moon')) { circle(ctx, 498, 76, 24); ctx.fill(); }
  else {
    circle(ctx, 498, 76, 24); ctx.fill();
    ctx.fillStyle = '#16233f'; circle(ctx, 508, 70, 20); ctx.fill();
  }
  ctx.fillStyle = '#f5e6c8';
  [[452, 52], [540, 48], [462, 118], [532, 122], [498, 44]].forEach(([x, y]) => { star(ctx, x, y, 4); ctx.fill(); });
  ctx.strokeStyle = '#2c1e12'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(498, 34); ctx.lineTo(498, 146); ctx.moveTo(432, 90); ctx.lineTo(564, 90); ctx.stroke();

  // picture frame + gears on the wall
  ctx.fillStyle = '#d9a441'; rr(ctx, 196, 44, 92, 66, 4); ctx.fill();
  ctx.fillStyle = '#3f6d4e'; ctx.fillRect(204, 52, 76, 50);
  ctx.fillStyle = '#7bc96f'; circle(ctx, 232, 84, 12); ctx.fill(); circle(ctx, 256, 78, 9); ctx.fill();
  ctx.fillStyle = '#8a5a33'; ctx.fillRect(238, 96, 5, 6);
  ctx.fillStyle = '#c9a86a';
  [[330, 118, 20], [362, 96, 13]].forEach(([x, y, r]) => {
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      ctx.fillRect(x + Math.cos(a) * r - 3, y + Math.sin(a) * r - 3, 6, 6);
    }
    circle(ctx, x, y, r); ctx.fill();
    ctx.fillStyle = '#8a5a33'; circle(ctx, x, y, 5); ctx.fill(); ctx.fillStyle = '#c9a86a';
  });

  // hanging lantern, top left
  ctx.strokeStyle = '#2c1e12'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(52, 0); ctx.lineTo(52, 30); ctx.stroke();
  ctx.fillStyle = '#e4572e'; rr(ctx, 30, 30, 44, 52, 18); ctx.fill();
  ctx.fillStyle = '#ffb347'; rr(ctx, 38, 40, 28, 32, 12); ctx.fill();
  ctx.fillStyle = '#2c1e12'; ctx.fillRect(26, 28, 52, 6); ctx.fillRect(26, 80, 52, 6);

  // grandfather clock (diff 2: hands 10:10 vs 2:35)
  ctx.fillStyle = '#4a2c14'; rr(ctx, 58, 92, 118, 292, 10); ctx.fill();
  ctx.fillStyle = '#6b4423'; rr(ctx, 66, 100, 102, 276, 8); ctx.fill();
  ctx.fillStyle = '#f5e6c8'; circle(ctx, 117, 152, 44); ctx.fill();
  ctx.strokeStyle = '#4a2c14'; ctx.lineWidth = 4; circle(ctx, 117, 152, 44); ctx.stroke();
  ctx.fillStyle = '#241505';
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    circle(ctx, 117 + Math.cos(a) * 36, 152 + Math.sin(a) * 36, 2.5); ctx.fill();
  }
  ctx.strokeStyle = '#241505'; ctx.lineCap = 'round';
  const hands = mods.has('hands') ? [[-0.9, 26], [2.2, 34]] : [[-2.2, 26], [0.9, 34]];
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(117, 152);
  ctx.lineTo(117 + Math.sin(hands[0][0]) * hands[0][1], 152 - Math.cos(hands[0][0]) * hands[0][1]); ctx.stroke();
  ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(117, 152);
  ctx.lineTo(117 + Math.sin(hands[1][0]) * hands[1][1], 152 - Math.cos(hands[1][0]) * hands[1][1]); ctx.stroke();
  circle(ctx, 117, 152, 4); ctx.fill();
  // pendulum + weights
  ctx.strokeStyle = '#c9a86a'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(117, 200); ctx.lineTo(117, 300); ctx.stroke();
  ctx.fillStyle = '#d9a441'; circle(ctx, 117, 312, 16); ctx.fill();
  ctx.fillStyle = '#8a5a33'; circle(ctx, 92, 250, 6); ctx.fill(); circle(ctx, 142, 250, 6); ctx.fill();
  // cuckoo bird on top (diff 1: present vs gone)
  if (!mods.has('bird')) {
    ctx.fillStyle = '#3f6d8e'; ellipse(ctx, 117, 76, 20, 13); ctx.fill();
    ctx.fillStyle = '#ffb347'; poly(ctx, [[134, 72], [146, 76], [134, 80]]); ctx.fill();
    ctx.fillStyle = '#241505'; circle(ctx, 124, 72, 2); ctx.fill();
    ctx.fillStyle = '#e4572e'; poly(ctx, [[108, 64], [112, 56], [116, 64]]); ctx.fill();
  }

  // bookshelf with books (diff 4: extra red book on the right end)
  ctx.fillStyle = '#4a2c14'; ctx.fillRect(376, 196, 208, 10); ctx.fillRect(376, 250, 208, 10);
  const books = [
    [384, 158, 16, 38, '#e4572e'], [400, 164, 14, 32, '#3f6d8e'], [414, 156, 18, 40, '#7bc96f'],
    [432, 162, 14, 34, '#d9a441'], [446, 158, 16, 38, '#8e5aa8'], [462, 166, 12, 30, '#e4572e'],
    [474, 160, 16, 36, '#3f6d8e'], [490, 164, 14, 32, '#c96a2e'], [504, 158, 16, 38, '#7bc96f'],
  ];
  books.forEach(([x, y, w, h, c]) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(x, y, w, 4); });
  if (mods.has('book')) { ctx.fillStyle = '#c0392b'; ctx.fillRect(520, 150, 18, 46); ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(520, 150, 18, 5); }
  ctx.fillStyle = '#d9a441'; circle(ctx, 556, 178, 14); ctx.fill(); // brass globe on shelf
  ctx.fillStyle = '#3f6d8e'; circle(ctx, 556, 178, 8); ctx.fill();
  // second shelf: jars + scroll
  ctx.fillStyle = '#3f6d8e'; rr(ctx, 392, 224, 22, 26, 4); ctx.fill();
  ctx.fillStyle = '#7bc96f'; rr(ctx, 424, 228, 18, 22, 4); ctx.fill();
  ctx.fillStyle = '#f5e6c8'; rr(ctx, 452, 226, 46, 24, 6); ctx.fill();
  ctx.fillStyle = '#e4572e'; ctx.fillRect(466, 226, 4, 24);

  // table + teapot (diff 6: steam present vs gone)
  ctx.fillStyle = '#4a2c14'; ctx.fillRect(292, 306, 190, 12);
  ctx.fillStyle = '#3a2110'; ctx.fillRect(306, 318, 12, 34); ctx.fillRect(456, 318, 12, 34);
  ctx.fillStyle = '#8e5aa8'; ellipse(ctx, 386, 288, 30, 22); ctx.fill();
  ctx.fillStyle = '#8e5aa8'; poly(ctx, [[412, 280], [432, 272], [430, 282], [412, 292]]); ctx.fill();
  ctx.fillStyle = '#6b3f7d'; rr(ctx, 378, 262, 16, 8, 4); ctx.fill();
  ctx.fillStyle = '#f5e6c8'; ellipse(ctx, 350, 296, 12, 5); ctx.fill(); ellipse(ctx, 420, 296, 12, 5); ctx.fill();
  if (!mods.has('steam')) {
    ctx.strokeStyle = 'rgba(245,230,200,.75)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    [[378, 252], [392, 246], [384, 236]].forEach(([x, y], i) => {
      ctx.beginPath(); ctx.moveTo(x, y + 8); ctx.quadraticCurveTo(x + 6, y, x - 2, y - 6); ctx.stroke();
    });
  }

  // rug with diamond pattern (diff 7: centre diamond gold vs bare)
  ctx.fillStyle = '#a83c2a'; ellipse(ctx, 300, 402, 196, 36); ctx.fill();
  ctx.fillStyle = '#d9a441'; ellipse(ctx, 300, 402, 168, 28); ctx.fill();
  ctx.fillStyle = '#a83c2a'; ellipse(ctx, 300, 402, 140, 20); ctx.fill();
  ctx.fillStyle = '#d9a441';
  [[180, 402], [240, 402], [360, 402], [420, 402]].forEach(([x, y]) => { poly(ctx, [[x, y - 9], [x + 9, y], [x, y + 9], [x - 9, y]]); ctx.fill(); });
  if (!mods.has('rug')) { ctx.fillStyle = '#ffb347'; poly(ctx, [[300, 393], [309, 402], [300, 411], [291, 402]]); ctx.fill(); }

  // sleeping cat on the rug (diff 3: bowtie red vs teal)
  ctx.fillStyle = '#e8a34c'; ellipse(ctx, 232, 388, 34, 16); ctx.fill();
  ctx.fillStyle = '#e8a34c'; circle(ctx, 200, 380, 14); ctx.fill();
  ctx.fillStyle = '#e8a34c'; poly(ctx, [[190, 372], [194, 360], [200, 370]]); ctx.fill(); poly(ctx, [[206, 370], [212, 360], [214, 372]]); ctx.fill();
  ctx.fillStyle = '#d18a35'; ellipse(ctx, 252, 390, 12, 8); ctx.fill(); // curled tail
  ctx.fillStyle = '#241505'; ctx.fillRect(196, 378, 6, 1.5); // closed eye
  ctx.fillStyle = mods.has('bowtie') ? '#2e8b8b' : '#e4572e';
  poly(ctx, [[214, 390], [222, 386], [222, 394]]); ctx.fill();
  poly(ctx, [[214, 390], [206, 386], [206, 394]]); ctx.fill();
  circle(ctx, 214, 390, 3); ctx.fill();
}

// --------------------------------------------------------------- market ---
export function drawMarket(ctx, mods) {
  // night sky + string lights
  const sky = ctx.createLinearGradient(0, 0, 0, 440);
  sky.addColorStop(0, '#1b2340'); sky.addColorStop(1, '#3a2a4a');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, 600, 440);
  ctx.fillStyle = '#f5e6c8';
  [[60, 30], [180, 22], [330, 34], [470, 26], [560, 44], [120, 60], [400, 58]].forEach(([x, y]) => { star(ctx, x, y, 3.5); ctx.fill(); });
  ctx.fillStyle = '#ffe9a8'; circle(ctx, 540, 60, 18); ctx.fill();
  // bunting (diff 8: one flag yellow vs purple)
  ctx.strokeStyle = '#c9a86a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, 26); ctx.quadraticCurveTo(300, 70, 600, 26); ctx.stroke();
  const flagColors = ['#e4572e', '#ffb347', '#7bc96f', '#3f6d8e', '#8e5aa8'];
  for (let i = 0; i < 9; i++) {
    const x = 40 + i * 62, y = 30 + Math.sin(i * 0.7) * 8 + 8;
    ctx.fillStyle = (i === 7 && mods.has('flag')) ? '#8e5aa8' : (i === 7 ? '#ffb347' : flagColors[i % 5]);
    poly(ctx, [[x - 11, y], [x + 11, y], [x, y + 22]]); ctx.fill();
  }
  // ground
  ctx.fillStyle = '#2c2118'; ctx.fillRect(0, 360, 600, 80);
  ctx.fillStyle = '#3a2c1e'; for (let x = 0; x < 600; x += 48) ctx.fillRect(x, 396, 24, 4);

  // stall: posts, counter, awning (diff 5: one awning stripe red vs blue)
  ctx.fillStyle = '#5d3a1e'; ctx.fillRect(84, 110, 14, 250); ctx.fillRect(502, 110, 14, 250);
  const awning = ['#e4572e', '#f5e6c8', '#e4572e', '#f5e6c8', '#e4572e', '#f5e6c8', '#e4572e', '#f5e6c8'];
  if (mods.has('awning')) awning[2] = '#3f6d8e';
  for (let i = 0; i < 8; i++) { ctx.fillStyle = awning[i]; ctx.fillRect(84 + i * 53, 66, 53, 46); }
  ctx.fillStyle = '#c0392b'; ctx.fillRect(84, 108, 428, 8);
  ctx.fillStyle = '#6b4423'; ctx.fillRect(76, 300, 448, 18);
  ctx.fillStyle = '#8a5a33'; ctx.fillRect(76, 318, 448, 42);
  ctx.fillStyle = '#5d3a1e'; ctx.fillRect(90, 360, 420, 8);

  // hanging lanterns (diff 1: left lantern red vs green)
  [[150, 148], [300, 138], [450, 148]].forEach(([x, y], i) => {
    ctx.strokeStyle = '#2c1e12'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, 116); ctx.lineTo(x, y - 18); ctx.stroke();
    const col = (i === 0 && mods.has('lantern')) ? '#2e8b57' : '#e4572e';
    ctx.fillStyle = col; rr(ctx, x - 17, y - 18, 34, 40, 14); ctx.fill();
    ctx.fillStyle = '#ffb347'; rr(ctx, x - 10, y - 10, 20, 24, 8); ctx.fill();
    ctx.fillStyle = '#2c1e12'; ctx.fillRect(x - 20, y - 20, 40, 4); ctx.fillRect(x - 20, y + 20, 40, 4);
  });

  // sign board (diff 3: TEH vs KOPI)
  ctx.strokeStyle = '#2c1e12'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(272, 116); ctx.lineTo(272, 158); ctx.moveTo(328, 116); ctx.lineTo(328, 158); ctx.stroke();
  ctx.fillStyle = '#2e2115'; rr(ctx, 238, 158, 124, 44, 8); ctx.fill();
  ctx.strokeStyle = '#d9a441'; ctx.lineWidth = 2; rr(ctx, 238, 158, 124, 44, 8); ctx.stroke();
  text(ctx, mods.has('sign') ? 'KOPI' : 'TEH', 300, 174, 20, '#ffb347');
  text(ctx, 'HANGAT · 5K', 300, 193, 11, '#c9a86a');

  // oranges pile (diff 2: five oranges vs four)
  const oranges = [[168, 292], [188, 292], [178, 278], [198, 278], [188, 264]];
  oranges.forEach(([x, y], i) => {
    if (mods.has('orange') && i === 4) return;
    ctx.fillStyle = '#e8862e'; circle(ctx, x, y, 13); ctx.fill();
    ctx.fillStyle = '#7bc96f'; circle(ctx, x + 3, y - 12, 3); ctx.fill();
  });
  // apples pile
  [[288, 292], [308, 292], [298, 278]].forEach(([x, y]) => {
    ctx.fillStyle = '#c0392b'; circle(ctx, x, y, 13); ctx.fill();
    ctx.fillStyle = '#7bc96f'; circle(ctx, x + 3, y - 12, 3); ctx.fill();
  });
  // dumpling steamer (diff 7: steam present vs gone)
  ctx.fillStyle = '#8a5a33'; rr(ctx, 396, 268, 56, 32, 6); ctx.fill();
  ctx.fillStyle = '#a86a3a'; rr(ctx, 392, 260, 64, 12, 6); ctx.fill();
  ctx.fillStyle = '#f5e6c8';
  [[410, 256], [424, 252], [438, 256]].forEach(([x, y]) => { ellipse(ctx, x, y, 8, 5); ctx.fill(); });
  if (!mods.has('steam')) {
    ctx.strokeStyle = 'rgba(245,230,200,.8)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    [[414, 244], [428, 238]].forEach(([x, y]) => {
      ctx.beginPath(); ctx.moveTo(x, y + 8); ctx.quadraticCurveTo(x + 5, y, x - 2, y - 6); ctx.stroke();
    });
  }
  // coins on the counter (diff 6: five coins vs three)
  const coins = [[238, 312], [252, 312], [266, 312], [245, 304], [259, 304]];
  coins.forEach(([x, y], i) => {
    if (mods.has('coins') && i >= 3) return;
    ctx.fillStyle = '#d9a441'; circle(ctx, x, y, 6); ctx.fill();
    ctx.fillStyle = '#b8860b'; circle(ctx, x, y, 3); ctx.fill();
  });
  // teapot + cups on the counter
  ctx.fillStyle = '#3f6d8e'; ellipse(ctx, 340, 296, 16, 11); ctx.fill();
  ctx.fillStyle = '#f5e6c8'; rr(ctx, 366, 292, 14, 12, 3); ctx.fill(); rr(ctx, 386, 292, 14, 12, 3); ctx.fill();

  // crate + cat (diff 4: cat present vs gone)
  ctx.fillStyle = '#6b4423'; ctx.fillRect(512, 330, 62, 34);
  ctx.strokeStyle = '#4a2c14'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(512, 347); ctx.lineTo(574, 347); ctx.moveTo(543, 330); ctx.lineTo(543, 364); ctx.stroke();
  if (!mods.has('cat')) {
    ctx.fillStyle = '#3a3a3a'; ellipse(ctx, 543, 322, 22, 11); ctx.fill();
    ctx.fillStyle = '#3a3a3a'; circle(ctx, 524, 314, 10); ctx.fill();
    ctx.fillStyle = '#3a3a3a'; poly(ctx, [[516, 308], [519, 298], [523, 307]]); ctx.fill(); poly(ctx, [[528, 307], [532, 298], [533, 308]]); ctx.fill();
    ctx.fillStyle = '#ffb347'; circle(ctx, 521, 313, 1.8); ctx.fill(); circle(ctx, 527, 313, 1.8); ctx.fill();
    ctx.fillStyle = '#3a3a3a'; ellipse(ctx, 560, 324, 10, 5); ctx.fill(); // tail
  }
  // paper fan leaning on the stall
  ctx.fillStyle = '#e4572e'; poly(ctx, [[96, 300], [140, 300], [118, 250]]); ctx.fill();
  ctx.fillStyle = '#f5e6c8'; poly(ctx, [[104, 296], [132, 296], [118, 262]]); ctx.fill();
}

// --------------------------------------------------------------- garden ---
export function drawGarden(ctx, mods) {
  // night sky, moon, stars (diff 7: one extra star)
  const sky = ctx.createLinearGradient(0, 0, 0, 440);
  sky.addColorStop(0, '#0e1a33'); sky.addColorStop(1, '#274b3a');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, 600, 440);
  ctx.fillStyle = '#ffe9a8'; circle(ctx, 500, 72, 30); ctx.fill();
  ctx.fillStyle = '#f5d97a'; circle(ctx, 490, 64, 6); ctx.fill(); circle(ctx, 510, 80, 5); ctx.fill(); circle(ctx, 502, 58, 4); ctx.fill();
  ctx.fillStyle = '#f5e6c8';
  const stars = [[60, 40], [140, 70], [220, 36], [300, 60], [380, 40], [450, 110], [90, 120], [250, 100], [560, 140], [40, 180]];
  stars.forEach(([x, y], i) => {
    if (mods.has('star') && i === 1) return; // diff 7: this star is gone on the right
    star(ctx, x, y, 4); ctx.fill();
  });
  // hills
  ctx.fillStyle = '#1d3a2c'; ellipse(ctx, 120, 330, 260, 90); ctx.fill();
  ctx.fillStyle = '#24463a'; ellipse(ctx, 500, 340, 280, 90); ctx.fill();
  // firefly cluster (diff 1: cluster of three vs none) near (350,150)
  if (!mods.has('fireflies')) {
    ctx.fillStyle = '#d8ff7a';
    [[336, 142], [356, 152], [348, 166]].forEach(([x, y]) => {
      ctx.shadowColor = '#d8ff7a'; ctx.shadowBlur = 12; circle(ctx, x, y, 4); ctx.fill();
    });
    ctx.shadowBlur = 0;
  }
  ctx.fillStyle = '#d8ff7a';
  [[90, 200], [180, 130], [470, 190], [540, 230], [260, 210]].forEach(([x, y]) => {
    ctx.shadowColor = '#d8ff7a'; ctx.shadowBlur = 10; circle(ctx, x, y, 3); ctx.fill();
  });
  ctx.shadowBlur = 0;

  // butterfly (diff 4: left flower vs right flower)
  const bf = mods.has('butterfly') ? [386, 196] : [252, 178];
  ctx.fillStyle = '#ffb347';
  ellipse(ctx, bf[0] - 8, bf[1], 10, 7); ctx.fill();
  ellipse(ctx, bf[0] + 8, bf[1], 10, 7); ctx.fill();
  ctx.fillStyle = '#8e5aa8';
  ellipse(ctx, bf[0] - 8, bf[1] + 6, 7, 5); ctx.fill();
  ellipse(ctx, bf[0] + 8, bf[1] + 6, 7, 5); ctx.fill();
  ctx.fillStyle = '#241505'; rr(ctx, bf[0] - 2, bf[1] - 6, 4, 14, 2); ctx.fill();

  // pond with lily pads (diff 6: ripples present vs gone; diff 3: frog)
  ctx.fillStyle = '#1d4a5e'; ellipse(ctx, 300, 388, 250, 52); ctx.fill();
  ctx.fillStyle = '#2a6a80'; ellipse(ctx, 300, 384, 240, 46); ctx.fill();
  ctx.fillStyle = '#3f8e4d';
  ellipse(ctx, 200, 384, 34, 12); ctx.fill();
  ellipse(ctx, 420, 392, 30, 11); ctx.fill();
  ellipse(ctx, 330, 378, 26, 10); ctx.fill();
  if (!mods.has('ripples')) {
    ctx.strokeStyle = 'rgba(245,230,200,.6)'; ctx.lineWidth = 2;
    ellipse(ctx, 420, 392, 44, 15); ctx.stroke();
    ellipse(ctx, 420, 392, 58, 20); ctx.stroke();
  }
  if (!mods.has('frog')) {
    ctx.fillStyle = '#5aa843'; circle(ctx, 330, 366, 13); ctx.fill();
    ctx.fillStyle = '#5aa843'; circle(ctx, 320, 354, 7); ctx.fill(); circle(ctx, 340, 354, 7); ctx.fill();
    ctx.fillStyle = '#fff'; circle(ctx, 320, 354, 3.5); ctx.fill(); circle(ctx, 340, 354, 3.5); ctx.fill();
    ctx.fillStyle = '#241505'; circle(ctx, 320, 354, 1.8); ctx.fill(); circle(ctx, 340, 354, 1.8); ctx.fill();
  }

  // mushrooms (diff 5: three spots vs five)
  ctx.fillStyle = '#f5e6c8'; rr(ctx, 82, 330, 12, 22, 4); ctx.fill(); rr(ctx, 104, 338, 10, 16, 4); ctx.fill();
  ctx.fillStyle = '#c0392b';
  poly(ctx, [[66, 332], [110, 332], [88, 306]]); ctx.fill();
  poly(ctx, [[96, 340], [124, 340], [110, 320]]); ctx.fill();
  ctx.fillStyle = '#fff';
  const spots = [[80, 322], [92, 316], [86, 328], [104, 330], [114, 332]];
  spots.forEach(([x, y], i) => { if (mods.has('spots') && i >= 3) return; circle(ctx, x, y, 3); ctx.fill(); });

  // flowers (diff 2: one bloom pink vs yellow)
  const flowers = [[150, 360, '#e87aa8'], [200, 368, '#e87aa8'], [250, 356, '#f5e6c8'], [380, 362, '#e87aa8'], [440, 352, '#f5e6c8'], [490, 368, '#e87aa8']];
  flowers.forEach(([x, y, c], i) => {
    ctx.strokeStyle = '#3f8e4d'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 22); ctx.stroke();
    const col = (i === 1 && mods.has('flower')) ? '#ffd94d' : c;
    ctx.fillStyle = col;
    for (let p = 0; p < 5; p++) {
      const a = (p * Math.PI * 2) / 5 - Math.PI / 2;
      circle(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 6); ctx.fill();
    }
    ctx.fillStyle = '#ffb347'; circle(ctx, x, y, 5); ctx.fill();
  });

  // snail (diff 9: present vs gone)
  if (!mods.has('snail')) {
    ctx.fillStyle = '#c9a86a'; ellipse(ctx, 150, 400, 16, 8); ctx.fill();
    ctx.fillStyle = '#8e5aa8'; circle(ctx, 146, 392, 10); ctx.fill();
    ctx.strokeStyle = '#6b3f7d'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(146, 392, 5, 0, Math.PI * 1.5); ctx.stroke();
    ctx.strokeStyle = '#c9a86a';
    ctx.beginPath(); ctx.moveTo(136, 394); ctx.lineTo(132, 386); ctx.moveTo(140, 394); ctx.lineTo(138, 385); ctx.stroke();
  }

  // stone lantern (diff 8: lit vs dark)
  ctx.fillStyle = '#7a7a72'; ctx.fillRect(508, 336, 26, 8); ctx.fillRect(512, 296, 18, 40); ctx.fillRect(502, 344, 38, 8);
  ctx.fillStyle = '#8a8a80'; poly(ctx, [[500, 296], [542, 296], [521, 278]]); ctx.fill();
  ctx.fillStyle = '#5a5a52'; rr(ctx, 508, 306, 26, 24, 3); ctx.fill();
  if (!mods.has('lantern')) {
    ctx.fillStyle = '#ffd94d'; rr(ctx, 514, 312, 14, 12, 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,217,77,.25)'; circle(ctx, 521, 318, 22); ctx.fill();
  }
  // grass tufts
  ctx.strokeStyle = '#3f8e4d'; ctx.lineWidth = 2;
  [[60, 420], [260, 424], [360, 420], [560, 420]].forEach(([x, y]) => {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 4, y - 12); ctx.moveTo(x, y); ctx.lineTo(x, y - 14); ctx.moveTo(x, y); ctx.lineTo(x + 4, y - 12); ctx.stroke();
  });
}

export const SCENES = { attic: drawAttic, market: drawMarket, garden: drawGarden };
