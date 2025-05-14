(function () {
  const cookieName = 'slk_attribution';
  const existing = Cookies.get(cookieName);
  let data = existing ? JSON.parse(existing) : {};

  const params = {};
  window.location.search
    .slice(1)
    .split('&')
    .forEach(p => {
      const [k, v] = p.split('=');
      if (k && v) params[k] = decodeURIComponent(v);
    });

  const currentUrl = window.location.href;
  const timestamp = new Date().toISOString();

  if (!data.landing_page) {
    data.landing_page = {
      url: currentUrl,
      params,
      timestamp
    };
  }

  if (Object.keys(params).length > 0) {
    data.param_pages = data.param_pages || [];
    const last = data.param_pages[data.param_pages.length - 1];

    const isDuplicate = last && last.url === currentUrl && JSON.stringify(last.params) === JSON.stringify(params);

    const isLandingPage = data.landing_page.url === currentUrl;

    if (!isDuplicate && !isLandingPage) {
      data.param_pages.push({
        url: currentUrl,
        params,
        timestamp
      });
    }
  }

  Cookies.set(cookieName, JSON.stringify(data), {
    expires: 7,
    path: '/',
    sameSite: 'Lax',
    domain: window.location.hostname.includes('sleak.chat') ? '.sleak.chat' : undefined,
    secure: true
  });

  console.log(JSON.stringify(data, null, 2));
})();
