(() => {
  const forms = document.querySelectorAll('[data-newsletter-form]');
  if (!forms.length) return;
  async function request(url, options = {}, timeout = 15000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try { return await fetch(url, {...options, credentials: 'omit', signal: controller.signal}); }
    finally { clearTimeout(timer); }
  }
  let turnstileReady;
  if (typeof window.turnstile?.render === 'function') turnstileReady = Promise.resolve();
  else {
    turnstileReady = new Promise((resolve, reject) => {
      const deadline = Date.now() + 20000;
      const check = () => {
        if (typeof window.turnstile?.render === 'function') resolve();
        else if (Date.now() >= deadline) reject(new Error('Spam check unavailable. Please reload and try again.'));
        else setTimeout(check, 100);
      };
      if (!document.querySelector('script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.onerror = () => reject(new Error('Spam check unavailable. Please reload and try again.'));
        document.head.append(script);
      }
      check();
    });
  }
  for (const form of forms) {
    // Use the form action so the script can be served locally by a static site.
    const base = new URL(form.action, window.location.href).origin;
    const configuration = request(`${base}/signup/config`).then(r => {
      if (!r.ok) throw new Error('Signup is temporarily unavailable. Please try again later.');
      return r.json();
    });
    const button = form.querySelector('[type="submit"]');
    const status = form.querySelector('[data-newsletter-status]');
    button.disabled = false;
    status.textContent = 'Loading the spam check…';
    let widgetId;
    let verified = false;
    let failure = '';
    Promise.all([configuration, turnstileReady]).then(([config]) => {
      // The API is already loaded here. ready() rejects async/defer script tags.
      try {
        widgetId = window.turnstile.render(form.querySelector('[data-newsletter-turnstile]'), {
          sitekey: config.siteKey, action: 'newsletter',
          callback: () => { verified = true; failure = ''; status.textContent = ''; },
          'expired-callback': () => { verified = false; status.textContent = 'Spam check expired. Please complete it again.'; },
          'error-callback': () => { verified = false; failure = 'Spam check failed. Please reload and try again.'; status.textContent = failure; }
        });
      } catch { failure = 'The spam check could not start. Please reload and try again.'; status.textContent = failure; }
    }).catch(error => {
      failure = error instanceof TypeError || error.name === 'AbortError'
        ? 'Could not connect to signup. Please reload and try again in a few minutes.'
        : error.message;
      status.textContent = failure;
    });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!verified) {
        status.textContent = failure || 'Please wait for the spam check to finish, then try Subscribe again.';
        return;
      }
      button.disabled = true;
      status.textContent = 'Submitting…';
      try {
        const response = await request(`${base}/signup`, {
          method: 'POST', headers: {'Accept': 'application/json'},
          body: new URLSearchParams(new FormData(form))
        }, 30000);
        const result = await response.json();
        status.textContent = result.message || 'Could not submit. Please try again.';
        if (response.ok) form.querySelector('[name="email"]').value = '';
      } catch { status.textContent = 'Could not submit. Please try again.'; }
      finally {
        verified = false;
        button.disabled = false;
        if (widgetId !== undefined) window.turnstile.reset(widgetId);
      }
    });
  }
})();
