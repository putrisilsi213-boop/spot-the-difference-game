// Interactive playtest: real mouse clicks + keyboard play, no ?shot= staging.
import { chromium } from '/home/hatch/workspace/makefun/node_modules/playwright-core/index.mjs';
import { spawn } from 'node:child_process';

const server = spawn(process.execPath, ['serve.ts'], { cwd: process.cwd(), stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1200));
const errors = [];
const browser = await chromium.launch({
  executablePath: '/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome',
  args: ['--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('console', (m) => { if (m.type() === 'error') errors.push('[console.error] ' + m.text().slice(0, 200)); });
page.on('pageerror', (e) => errors.push('[pageerror] ' + String(e).slice(0, 200)));
const txt = (sel) => page.$eval(sel, (el) => el.textContent);

await page.goto('http://localhost:8080/', { waitUntil: 'load' });
await page.waitForTimeout(400);
console.log('menu visible:', await page.$eval('#menu-overlay', (el) => !el.hidden));
// start level 1 by clicking its card
await page.click('.level-card');
await page.waitForTimeout(400);
console.log('after start:', await txt('#counter'), '| timer:', await txt('#timer-text'));

// click the moon difference on the LEFT canvas (scene 498,76 -> canvas coords)
const box = await page.$eval('#canvas-left', (el) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
await page.mouse.click(box.x + (498 / 600) * box.w, box.y + (76 / 440) * box.h);
await page.waitForTimeout(300);
console.log('after moon click:', await txt('#counter'), '| score:', await txt('#score-value'), '| markers:', await page.$$eval('.marker', (els) => els.length));
// wrong click on empty wall (scene 300,120 is gears area... use 60,420 floor corner? use 560,420)
await page.mouse.click(box.x + (560 / 600) * box.w, box.y + (420 / 440) * box.h);
await page.waitForTimeout(300);
console.log('after miss click:', await txt('#counter'), '| hearts html:', await txt('#hearts'), '| timer:', await txt('#timer-text'));
// keyboard: move reticle to the bird (117,76) via arrows is slow; use hint instead
await page.keyboard.press('h');
await page.waitForTimeout(300);
console.log('after hint: hints left:', await txt('#hints-left'), '| hint pulses:', await page.$$eval('.marker.hint-pulse', (els) => els.length));
// keyboard reticle: press Tab + arrows then Enter at a known spot is unreliable;
// instead verify reticle appears and Enter marks *something* only when on a diff:
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(150);
console.log('reticle visible after arrows:', await page.$eval('#crosshair', (el) => !el.hidden));
// level select via keyboard 2 from menu
await page.keyboard.press('Escape');
await page.waitForTimeout(200);
console.log('menu visible after Esc:', await page.$eval('#menu-overlay', (el) => !el.hidden));
await page.keyboard.press('2');
await page.waitForTimeout(400);
console.log('after pressing 2:', await txt('#level-name'), '|', await txt('#counter'));
await browser.close();
server.kill();
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'no console/page errors');
console.log('playtest done');
