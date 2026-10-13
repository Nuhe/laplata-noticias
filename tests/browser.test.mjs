import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const profile = await mkdtemp(join(tmpdir(), 'infolaplata-browser-'));
const errors = [];
let browser;
let server;
let socket;

async function waitFor(probe, description) {
  for (let attempt = 0; attempt < 100; attempt++) {
    try { if (await probe()) return; } catch { /* The process may still be starting. */ }
    await sleep(100);
  }
  throw new Error(`Timed out waiting for ${description}`);
}

try {
  const portProbe = createServer();
  await new Promise(resolve => portProbe.listen(0, '127.0.0.1', resolve));
  const port = portProbe.address().port;
  await new Promise(resolve => portProbe.close(resolve));
  server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', 'dist'], { cwd: root, stdio: 'ignore' });
  const origin = `http://127.0.0.1:${port}`;
  await waitFor(async () => (await fetch(origin)).ok, 'preview server');
  browser = spawn('/usr/bin/chromium', [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
    '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0',
    `--user-data-dir=${profile}`, 'about:blank',
  ], { stdio: 'ignore' });
  let debugPort;
  await waitFor(async () => {
    debugPort = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0];
    return Boolean(debugPort);
  }, 'Chromium debugging endpoint');
  const pages = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
  socket = new WebSocket(pages[0].webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let nextId = 0;
  const pending = new Map();
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject, timer } = pending.get(message.id);
      clearTimeout(timer);
      pending.delete(message.id);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
    }
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 10000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails));
    return response.result.value;
  };
  const press = async key => {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code: key, windowsVirtualKeyCode: key === 'Escape' ? 27 : 0 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code: key, windowsVirtualKeyCode: key === 'Escape' ? 27 : 0 });
  };
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  for (const width of [1440, 768, 390]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: origin });
    await waitFor(() => evaluate("document.readyState === 'complete' && document.querySelectorAll('#article-grid .news-card').length === 3"), 'rendered articles');
    await evaluate('Promise.all([...document.images].map(image => { image.loading = "eager"; return image.decode().catch(() => {}); }))');
    assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, `No overflow at ${width}px`);
    assert.equal(await evaluate('[...document.images].every(image => image.complete && image.naturalWidth > 0)'), true, 'Images load');
    const imageRatio = await evaluate("(() => { const rect = document.querySelector('.secondary-story img').getBoundingClientRect(); return rect.width / rect.height; })()");
    assert.ok(Math.abs(imageRatio - (width === 390 ? 1.35 : 1.87)) < 0.02, 'Image aspect ratios override intrinsic height attributes');
    assert.equal(await evaluate("getComputedStyle(document.documentElement).scrollBehavior"), 'auto', 'Reduced motion disables smooth scrolling');
    await evaluate("document.querySelector('[data-open-search]').focus(); document.querySelector('[data-open-search]').click()");
    assert.equal(await evaluate("document.activeElement.id"), 'search-input');
    await evaluate("document.querySelector('#search-input').value = 'OPERA'; document.querySelector('#search-input').dispatchEvent(new Event('input'))");
    assert.equal(await evaluate("document.querySelectorAll('.search-result').length"), 1, 'Accent-insensitive search');
    await evaluate("document.querySelector('.search-result').click()");
    assert.equal(await evaluate("document.querySelector('#article-dialog').open"), true);
    assert.match(await evaluate("document.querySelector('#article-title').textContent"), /ópera/);
    await press('Escape');
    await sleep(100);
    assert.equal(await evaluate("document.querySelector('#article-dialog').open"), false);
    assert.equal(await evaluate("document.querySelector('#search-dialog').open"), true, 'Article closes back to search');
    await evaluate("document.querySelector('#search-input').value = 'zzzzzz'; document.querySelector('#search-input').dispatchEvent(new Event('input'))");
    assert.equal(await evaluate("document.querySelectorAll('.empty-state').length"), 1);
    await press('Escape');
    assert.equal(await evaluate("document.querySelector('#search-dialog').open"), false);
    assert.equal(await evaluate("document.activeElement.hasAttribute('data-open-search')"), true, 'Search restores trigger focus');
    await evaluate("document.querySelector('[data-filter=\"Cultura\"]').click()");
    assert.equal(await evaluate("document.querySelectorAll('#article-grid .news-card').length"), 2);
    assert.equal(await evaluate("document.activeElement.dataset.filter"), 'Cultura', 'Filter preserves focus');
    if (width === 390) {
      await evaluate("document.querySelector('.menu-toggle').click()");
      assert.equal(await evaluate("document.querySelector('.menu-toggle').getAttribute('aria-expanded')"), 'true');
      await press('Escape');
      assert.equal(await evaluate("document.querySelector('.menu-toggle').getAttribute('aria-expanded')"), 'false');
      await evaluate("document.querySelector('.menu-toggle').click(); document.querySelector('[data-nav=\"Deportes\"]').click()");
      assert.equal(await evaluate("document.querySelector('.menu-toggle').getAttribute('aria-expanded')"), 'false');
      assert.equal(await evaluate("document.querySelectorAll('#article-grid .news-card').length"), 1);
    }
    await evaluate("document.querySelector('#newsletter-email').value = 'reader@example.com'; document.querySelector('#newsletter-form').requestSubmit()");
    assert.match(await evaluate("document.querySelector('#newsletter-status').textContent"), /no se envió ni guardó/);
    await evaluate("document.querySelector('[data-filter=\"Todas\"]').click(); scrollTo(0, 800)");
    await sleep(100);
    assert.equal(await evaluate("document.querySelector('.back-to-top').hidden"), false);
    await evaluate("document.querySelector('.back-to-top').click()");
    await sleep(100);
    assert.equal(await evaluate('scrollY'), 0);
    await evaluate("document.activeElement.blur(); document.querySelector('#newsletter-status').textContent = 'Demo: no se envían ni guardan datos.'");
    const dimensions = await send('Page.getLayoutMetrics');
    const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: {
      x: 0, y: 0, width, height: dimensions.cssContentSize.height, scale: 1,
    } });
    const destination = `/tmp/infolaplata-${width}.png`;
    await writeFile(destination, Buffer.from(screenshot.data, 'base64'));
    console.log(`PASS ${width}px: overflow, images, search, article, focus, filters, newsletter, back-to-top, reduced motion. Screenshot: ${destination}`);
  }
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await send('Page.navigate', { url: origin });
  await waitFor(() => evaluate("document.querySelectorAll('.pending-reveal').length > 0"), 'scroll reveal setup');
  await evaluate('scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" })');
  await sleep(800);
  assert.equal(await evaluate("document.querySelector('.city-signoff').classList.contains('pending-reveal')"), false, 'Scroll reveal displays footer section');
  assert.deepEqual(errors, [], 'No runtime exceptions');
  console.log('PASS normal-motion scroll reveal; no JavaScript runtime exceptions.');
} finally {
  socket?.close();
  browser?.kill('SIGTERM');
  server?.kill('SIGTERM');
  if (browser && browser.exitCode === null) await Promise.race([new Promise(resolve => browser.once('exit', resolve)), sleep(3000)]);
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
