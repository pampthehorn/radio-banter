// Run with Node's test runner and Playwright available in NODE_PATH/node_modules.
// All external services are mocked: these checks send no email and solve no CAPTCHA.
const {test, before, after} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const {chromium} = require('playwright');
const root = join(__dirname, '..');
let browser;
before(async () => {
  browser = await chromium.launch({headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined});
});
after(async () => { if (browser) await browser.close(); });

async function fixture(t, configFails = false) {
  const page = await browser.newPage();
  t.after(() => page.close());
  let submissions = 0;
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname === 'radiobanter.net' && url.pathname === '/newsletter.html')
      return route.fulfill({contentType: 'text/html', body: readFileSync(join(root, 'newsletter.html'), 'utf8')});
    if (url.hostname === 'radiobanter.net' && url.pathname === '/newsletter-signup.js')
      return route.fulfill({contentType: 'text/javascript', body: readFileSync(join(root, 'newsletter-signup.js'), 'utf8')});
    if (url.hostname === 'challenges.cloudflare.com')
      return route.fulfill({contentType: 'text/javascript', body: `window.turnstile={ready:()=>{throw new Error('Remove async/defer before using turnstile.ready()');},render:(element,options)=>{const input=document.createElement('input');input.type='hidden';input.name='cf-turnstile-response';input.value='test-only-token';element.append(input);window.completeSignupCheck=()=>options.callback('test-only-token');return 'test-widget';},reset:()=>{}};`});
    if (url.hostname === 'lists.radiobanter.net' && url.pathname === '/signup/config') {
      if (configFails) return route.abort('failed');
      return route.fulfill({contentType: 'application/json', headers: {'Access-Control-Allow-Origin': 'https://radiobanter.net'}, body: JSON.stringify({siteKey: 'test-only-key'})});
    }
    if (url.hostname === 'lists.radiobanter.net' && url.pathname === '/signup' && route.request().method() === 'POST') {
      submissions++;
      const form = new URLSearchParams(route.request().postData());
      assert.equal(form.get('email'), 'reader@example.test');
      assert.equal(form.get('cf-turnstile-response'), 'test-only-token');
      return route.fulfill({contentType: 'application/json', headers: {'Access-Control-Allow-Origin': 'https://radiobanter.net'}, body: JSON.stringify({message: 'Check your inbox for your confirmation email.'})});
    }
    return route.abort();
  });
  await page.goto('https://radiobanter.net/newsletter.html');
  return {page, submissions: () => submissions, errors};
}

test('a click before the spam check finishes explains what is happening', async t => {
  const f = await fixture(t);
  await f.page.locator('[name=email]').fill('reader@example.test');
  await f.page.locator('[type=submit]').click();
  assert.match(await f.page.locator('[data-newsletter-status]').innerText(), /wait for the spam check/i);
  assert.equal(f.submissions(), 0);
  assert.deepEqual(f.errors, []);
});

test('an unreachable mailing-list hostname produces a visible error and a responsive button', async t => {
  const f = await fixture(t, true);
  await f.page.waitForFunction(() => document.querySelector('[data-newsletter-status]').textContent.includes('Could not connect'));
  await f.page.locator('[name=email]').fill('reader@example.test');
  await f.page.locator('[type=submit]').click();
  assert.match(await f.page.locator('[data-newsletter-status]').innerText(), /could not connect/i);
  assert.equal(await f.page.locator('[type=submit]').isEnabled(), true);
  assert.equal(f.submissions(), 0);
  assert.deepEqual(f.errors, []);
});

test('a completed spam check submits the email and displays the confirmation message', async t => {
  const f = await fixture(t);
  await f.page.waitForFunction(() => typeof window.completeSignupCheck === 'function');
  await f.page.evaluate(() => window.completeSignupCheck());
  await f.page.locator('[name=email]').fill('reader@example.test');
  await f.page.locator('[type=submit]').click();
  await f.page.waitForFunction(() => document.querySelector('[data-newsletter-status]').textContent.includes('Check your inbox'));
  assert.equal(f.submissions(), 1);
  assert.equal(await f.page.locator('[name=email]').inputValue(), '');
  assert.equal(await f.page.locator('[type=submit]').isEnabled(), true);
  assert.deepEqual(f.errors, []);
});
