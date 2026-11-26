/* =========================================================
   Ashetag — shared layout, illustrations and interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Icons (stroke, 24px grid) ---------- */
  const P = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICONS = {
    bolt: P('<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>'),
    bot: P('<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9 17h6"/><circle cx="12" cy="3" r="1"/>'),
    globe: P('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z"/>'),
    plug: P('<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0V7ZM12 17v5"/>'),
    chart: P('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
    mail: P('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    phone: P('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>'),
    shield: P('<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>'),
    lock: P('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    sparkle: P('<path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7ZM19 16c.2 1.4.9 2.1 2.3 2.3-1.4.2-2.1.9-2.3 2.3-.2-1.4-.9-2.1-2.3-2.3 1.4-.2 2.1-.9 2.3-2.3Z"/>'),
    flow: P('<rect x="3" y="3" width="7" height="6" rx="1.5"/><rect x="14" y="15" width="7" height="6" rx="1.5"/><path d="M6.5 9v3a3 3 0 0 0 3 3h4.5"/>'),
    code: P('<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/>'),
    arrow: P('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    chev: P('<path d="m9 6 6 6-6 6"/>'),
    check: P('<path d="m5 12 5 5 9-10"/>'),
    chat: P('<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 10h8M8 13h5"/>'),
    calendar: P('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    pin: P('<path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/>'),
    layers: P('<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>'),
    db: P('<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'),
    search: P('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    pen: P('<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13 7 4 4"/>'),
    cart: P('<path d="M3 4h2l2.4 11h10.8L21 7H6.2"/><circle cx="9" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/>'),
    users: P('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>'),
    gauge: P('<path d="M4 18a8 8 0 1 1 16 0"/><path d="m12 18 4-6"/>'),
    x: P('<path d="M4 4l16 16M20 4 4 20"/>'),
    link: P('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm7 0h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4V9.5Z"/></svg>',
    xlogo: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.6.5-3.2.5-4.8s-.1-3.2-.5-4.8ZM9.7 15.1V8.9L15.5 12l-5.8 3.1Z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.4 4.8 4.9-1.3A9.8 9.8 0 1 0 12 2.2Zm0 1.8a8 8 0 1 1-4.1 14.9l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 0 1 12 4Z"/><path fill="currentColor" d="M8.9 7.4c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.5.7c-.1.2-.2.3 0 .6.4.7 1 1.4 1.6 1.9.7.6 1.3.9 1.9 1.1.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .2 0 .9-.3 1.5-.3.6-1.4 1.2-2 1.2-.5.1-1.2.2-3.7-.9-3-1.3-4.8-4.4-5-4.6-.1-.2-1.2-1.6-1.2-3.1 0-1.4.7-2.1 1-2.4Z"/></svg>',
    logo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M2 19 9.6 4.6a1 1 0 0 1 1.8 0L13.5 8.6 9 19H2Z"/><path fill="currentColor" d="M11.5 19 15.6 10.4a1 1 0 0 1 1.8 0L22 19H11.5Z" opacity=".9"/></svg>'
  };
  window.ICONS = ICONS;

  /* ---------- Hand-drawn doodles (original line art) ---------- */
  const D = (vb, body) => `<svg class="doodle" viewBox="${vb}" aria-hidden="true">${body}</svg>`;
  const DOODLES = {
    rocket: D("0 0 120 120", '<path d="M62 18c14 8 24 26 22 46l-10 8H50l-9-9c-1-20 7-37 21-45Z"/><circle cx="63" cy="44" r="7.5"/><path d="M41 63 28 70l-3 15 18-8M84 64l12 9 1 14-17-8"/><path d="M52 80c-3 8-2 15 2 22 4-5 6-8 7-12 2 4 4 7 8 10 2-8 1-14-3-20"/><path d="M18 30l4 2M14 44h5M100 24l-4 3M104 40h-5"/>'),
    robot: D("0 0 120 120", '<rect x="30" y="38" width="60" height="46" rx="12"/><path d="M60 38V24"/><circle cx="60" cy="20" r="4.5"/><circle cx="47" cy="58" r="5"/><circle cx="73" cy="58" r="5"/><path d="M49 72c6 4 16 4 22 0"/><path d="M30 56h-8v14h8M90 56h8v14h-8"/><path d="M42 84v12M78 84v12M36 98h14M70 98h14"/>'),
    bulb: D("0 0 120 120", '<path d="M60 18c-17 0-28 12-28 27 0 11 6 17 11 23 3 4 4 8 4 12h26c0-4 1-8 4-12 5-6 11-12 11-23 0-15-11-27-28-27Z"/><path d="M48 88h24M50 96h20M55 104h10"/><path d="M60 80V60l-6-6M60 60l6-6"/><path d="M20 30l7 5M100 30l-7 5M14 54h8M106 54h-8"/>'),
    plane: D("0 0 120 120", '<path d="M14 58 104 22 84 98 60 74 14 58Z"/><path d="M104 22 60 74v22l12-14"/><path d="M14 90c10-4 18-2 24 4M8 104c12-6 26-4 34 6" stroke-dasharray="4 6"/>'),
    sparkle: D("0 0 120 120", '<path d="M60 14c3 22 14 33 36 36-22 3-33 14-36 36-3-22-14-33-36-36 22-3 33-14 36-36Z"/><path d="M96 78c1 8 5 12 13 13-8 1-12 5-13 13-1-8-5-12-13-13 8-1 12-5 13-13ZM24 82c.6 5 3 7 8 8-5 .6-7 3-8 8-.6-5-3-7-8-8 5-.6 7-3 8-8Z"/>'),
    browser: D("0 0 120 120", '<rect x="14" y="24" width="92" height="70" rx="8"/><path d="M14 38h92"/><circle cx="23" cy="31" r="1.8" class="fill"/><circle cx="30" cy="31" r="1.8" class="fill"/><circle cx="37" cy="31" r="1.8" class="fill"/><path d="M28 52h40M28 62h28"/><rect x="72" y="50" width="22" height="30" rx="4"/><path d="M28 76h14"/><path d="M96 98l8 12 3-7 7-1-12-9"/>'),
    gear: D("0 0 120 120", '<path d="M60 30l6 1 3-9 10 4-3 9 5 4 8-5 6 9-8 5 1 6 9 2-2 11-9-1-3 6 6 7-8 8-7-6-6 3 1 9-11 2-2-9-6-1-5 8-10-5 4-9-4-5-9 2-3-11 9-3v-6l-9-4 4-10 9 3 4-5-5-8 9-6 5 8 6-1Z"/><circle cx="60" cy="60" r="12"/>'),
    heart: D("0 0 120 120", '<path d="M60 98C34 80 18 64 18 46c0-12 9-22 21-22 9 0 16 5 21 13 5-8 12-13 21-13 12 0 21 10 21 22 0 18-16 34-42 52Z"/><path d="M34 46c1-6 5-10 11-10"/>'),
    compass: D("0 0 120 120", '<circle cx="60" cy="60" r="40"/><path d="M60 26v6M60 88v6M26 60h6M88 60h6"/><path d="M74 46 66 66 46 74l8-20 20-8Z"/><circle cx="60" cy="60" r="2.5" class="fill"/>'),
    burst: D("0 0 120 120", '<circle cx="60" cy="60" r="26"/><path d="m48 60 8 8 16-17"/><path d="M60 14v12M60 94v12M14 60h12M94 60h12M27 27l9 9M84 84l9 9M93 27l-9 9M36 84l-9 9"/>'),
    coffee: D("0 0 120 120", '<path d="M26 48h58v20c0 16-13 28-29 28S26 84 26 68V48Z"/><path d="M84 54h6c7 0 12 5 12 11s-5 11-12 11h-8"/><path d="M44 22c-4 6 4 10 0 16M58 18c-4 6 4 10 0 16M72 22c-4 6 4 10 0 16"/><path d="M20 104h76"/>'),
    mountain: D("0 0 120 120", '<path d="M8 96 44 40l18 26 12-16 38 46H8Z"/><path d="M36 52l8 6 6-6"/><circle cx="90" cy="28" r="9"/><path d="M14 104h92"/>'),
    city: D("0 0 120 120", '<path d="M12 100V54h20v46M32 100V28h24v72M56 100V44h20v56M76 100V62h30v38"/><path d="M38 40h4M46 40h4M38 52h4M46 52h4M38 64h4M46 64h4M62 56h4M62 68h4M84 72h4M94 72h4M18 66h4M18 78h4M6 100h108"/>'),
    wave: D("0 0 120 120", '<path d="M10 70c12-14 22-14 34 0s22 14 34 0 22-14 34 0"/><path d="M10 88c12-14 22-14 34 0s22 14 34 0 22-14 34 0"/><circle cx="84" cy="34" r="12"/><path d="M84 14v4M84 50v4M104 34h-4M68 34h-4"/>'),
    star: D("0 0 120 120", '<path d="m60 16 12 28 30 3-23 19 7 30-26-16-26 16 7-30-23-19 30-3 12-28Z"/>'),
    chart: D("0 0 120 120", '<path d="M16 100h90M16 100V18"/><path d="M26 84l20-22 16 12 30-38"/><path d="M80 36h12v12"/><rect x="28" y="88" width="8" height="10"/><rect x="48" y="80" width="8" height="18"/><rect x="68" y="72" width="8" height="26"/>')
  };
  window.DOODLES = DOODLES;

  /* ---------- Illustrated avatars (deterministic, original) ---------- */
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function avatar(seed, bgOverride) {
    const h = hash(seed);
    const pick = (arr, k) => arr[(h >>> k) % arr.length];
    const bg = bgOverride || pick(["#ffd7f0", "#b7efb2", "#ffef99", "#e2ddfd", "#cdeeff", "#ffe1c7"], 1);
    const skin = pick(["#f6d2b8", "#e9b48f", "#c98b62", "#a5694a", "#7a4a33", "#f3c9a5"], 3);
    const hair = pick(["#1d1a18", "#3b2416", "#6b3e22", "#b07a3e", "#d9b26b", "#2c2a3a"], 6);
    const shirt = pick(["#111111", "#272625", "#10054d", "#ffffff", "#e8400d", "#6d6c6b"], 9);
    const style = (h >>> 12) % 5;
    const glasses = ((h >>> 15) % 4) === 0;
    const smile = (h >>> 18) % 2;
    let back = "", front = "";
    if (style === 0) { front = `<path d="M62 92c0-26 16-40 38-40s38 14 38 40c-6-12-20-20-38-18-18-2-32 6-38 18Z" fill="${hair}"/>`; }
    if (style === 1) { back = `<path d="M54 100c0-34 20-52 46-52s46 18 46 52v66H54v-66Z" fill="${hair}"/>`; front = `<path d="M62 96c4-24 18-36 38-36s34 12 38 36c-14-10-26-16-38-16S76 86 62 96Z" fill="${hair}"/>`; }
    if (style === 2) { back = `<circle cx="100" cy="44" r="16" fill="${hair}"/>`; front = `<path d="M62 94c0-24 16-38 38-38s38 14 38 38c-10-10-24-16-38-16s-28 6-38 16Z" fill="${hair}"/>`; }
    if (style === 3) { const c = []; for (let i = 0; i < 9; i++) { const a = Math.PI + (i / 8) * Math.PI; c.push(`<circle cx="${100 + Math.cos(a) * 36}" cy="${92 + Math.sin(a) * 36}" r="15" fill="${hair}"/>`); } back = c.join("") + `<circle cx="64" cy="112" r="13" fill="${hair}"/><circle cx="136" cy="112" r="13" fill="${hair}"/>`; }
    if (style === 4) { front = `<path d="M66 84c6-18 20-26 34-26s28 8 34 26c-8-4-18-6-34-6s-26 2-34 6Z" fill="${hair}"/>`; }
    const mouth = smile ? `<path d="M90 124c6 6 14 6 20 0" fill="none" stroke="#5a2e1e" stroke-width="3" stroke-linecap="round"/>` : `<path d="M92 126h16" stroke="#5a2e1e" stroke-width="3" stroke-linecap="round"/>`;
    const gl = glasses ? `<g fill="none" stroke="#111" stroke-width="3"><circle cx="86" cy="106" r="9"/><circle cx="114" cy="106" r="9"/><path d="M95 106h10"/></g>` : "";
    return `<svg viewBox="0 0 200 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="200" height="220" fill="${bg}"/>
      <circle cx="160" cy="40" r="46" fill="#fff" opacity=".35"/>
      ${back}
      <path d="M40 220c4-40 28-60 60-60s56 20 60 60Z" fill="${shirt}"/>
      <path d="M88 150h24v18c0 7-24 7-24 0Z" fill="${skin}"/>
      <ellipse cx="100" cy="108" rx="36" ry="42" fill="${skin}"/>
      <ellipse cx="64" cy="112" rx="6" ry="9" fill="${skin}"/><ellipse cx="136" cy="112" rx="6" ry="9" fill="${skin}"/>
      ${front}
      <circle cx="86" cy="106" r="3.4" fill="#1d1a18"/><circle cx="114" cy="106" r="3.4" fill="#1d1a18"/>
      <path d="M100 110v8" stroke="#00000022" stroke-width="3" stroke-linecap="round"/>
      <circle cx="78" cy="120" r="6" fill="#ff8a8a" opacity=".25"/><circle cx="122" cy="120" r="6" fill="#ff8a8a" opacity=".25"/>
      ${mouth}${gl}
    </svg>`;
  }
  window.avatar = avatar;

  /* ---------- Site chrome ---------- */
  const page = document.body.dataset.page || "";
  const cur = (p) => (page === p ? ' aria-current="page"' : "");

  const header = `
  <header class="nav" id="nav">
    <div class="container nav__inner">
      <a href="index.html" class="logo" aria-label="Ashetag home">${ICONS.logo}<span>ashetag</span></a>
      <ul class="nav__links">
        <li class="nav__item has-dd">
          <a class="nav__link" href="product.html"${cur("product")} aria-haspopup="true">Product <svg class="chev" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.4"><path d="m1 1 4 4 4-4"/></svg></a>
          <div class="dropdown" role="menu">
            <a href="product.html#automations"><span class="dd-ico" style="background:var(--violet)">${ICONS.flow}</span><span><strong>AI Automations</strong><span class="d">Workflows that run your ops 24/7</span></span></a>
            <a href="product.html#agents"><span class="dd-ico" style="background:var(--pink)">${ICONS.bot}</span><span><strong>AI Agents</strong><span class="d">Assistants that answer, qualify and book</span></span></a>
            <a href="product.html#websites"><span class="dd-ico" style="background:var(--mint)">${ICONS.globe}</span><span><strong>Websites</strong><span class="d">Fast, beautiful sites that convert</span></span></a>
            <a href="product.html#integrations"><span class="dd-ico" style="background:var(--canary)">${ICONS.plug}</span><span><strong>Integrations</strong><span class="d">Connect the tools you already use</span></span></a>
          </div>
        </li>
        <li class="nav__item has-dd">
          <a class="nav__link" href="about.html"${cur("about")} aria-haspopup="true">Why us <svg class="chev" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.4"><path d="m1 1 4 4 4-4"/></svg></a>
          <div class="dropdown dropdown--one" role="menu">
            <a href="about.html"><span class="dd-ico" style="background:var(--cream)">${ICONS.users}</span><span><strong>About us</strong><span class="d">The people behind the bots</span></span></a>
            <a href="about.html#values"><span class="dd-ico" style="background:var(--cream)">${ICONS.sparkle}</span><span><strong>How we work</strong><span class="d">Principles we build by</span></span></a>
            <a href="index.html#results"><span class="dd-ico" style="background:var(--cream)">${ICONS.chart}</span><span><strong>Client results</strong><span class="d">Numbers, not promises</span></span></a>
          </div>
        </li>
        <li class="nav__item"><a class="nav__link" href="blog.html"${cur("blog")}>Blog</a></li>
        <li class="nav__item"><a class="nav__link" href="product.html#pricing">Pricing</a></li>
        <li class="nav__item"><a class="nav__link" href="contact.html"${cur("contact")}>Contact</a></li>
      </ul>
      <div class="nav__actions">
        <a href="contact.html" data-wa-link class="btn btn--sm btn--pearl hide-md"><span data-icon="whatsapp" style="width:16px"></span>WhatsApp us</a>
        <a href="contact.html#audit" class="btn btn--sm btn--ink">Get free AI audit</a>
        <button class="nav__burger" aria-label="Open menu" aria-expanded="false"><span></span></button>
      </div>
    </div>
  </header>
  <div class="mobile-menu" id="mobileMenu">
    <a class="m-link" href="index.html">Home ${ICONS.chev.replace("<svg", '<svg width="18"')}</a>
    <a class="m-link" href="product.html">Product ${ICONS.chev.replace("<svg", '<svg width="18"')}</a>
    <a class="m-link" href="about.html">About us ${ICONS.chev.replace("<svg", '<svg width="18"')}</a>
    <a class="m-link" href="blog.html">Blog ${ICONS.chev.replace("<svg", '<svg width="18"')}</a>
    <a class="m-link" href="contact.html">Contact ${ICONS.chev.replace("<svg", '<svg width="18"')}</a>
    <div class="m-actions"><a href="contact.html" data-wa-link class="btn btn--pearl"><span data-icon="whatsapp" style="width:18px"></span>WhatsApp us</a><a href="contact.html#audit" class="btn btn--ink">Get free AI audit</a></div>
  </div>`;

  const footer = `
  <footer class="footer">
    <section class="footer-cta">
      <div class="footer-cta__glow"></div>
      <div class="container" style="position:relative">
        <h2 class="display reveal">Put <span class="grad-text--warm">AI agents</span> to work for your business</h2>
        <form class="capture capture--dark reveal" data-delay="1" data-capture>
          <input type="text" placeholder="What would you like to automate?" aria-label="What would you like to automate?" maxlength="300">
          <button class="btn btn--white" type="submit"><span data-icon="whatsapp" style="width:18px"></span>WhatsApp us</button>
        </form>
        <p class="capture-note reveal" data-delay="2">Free 30-minute AI audit · We reply on WhatsApp within the hour</p>
      </div>
    </section>
    <div class="container">
      <div class="footer-links">
        <div>
          <a href="index.html" class="logo" style="color:#fff">${ICONS.logo}<span>ashetag</span></a>
          <p class="footer-blurb">An AI automation and web studio. We build the agents, workflows and websites that let small teams operate like big ones.</p>
        </div>
        <div><h4>Services</h4><ul>
          <li><a href="product.html#automations">AI Automations</a></li><li><a href="product.html#agents">AI Agents</a></li>
          <li><a href="product.html#websites">Websites</a></li><li><a href="product.html#integrations">Integrations</a></li><li><a href="product.html#pricing">Pricing</a></li></ul></div>
        <div><h4>Company</h4><ul>
          <li><a href="about.html">About us</a></li><li><a href="about.html#team">Team</a></li>
          <li><a href="about.html#careers">Careers<span class="hire">We're hiring</span></a></li><li><a href="contact.html">Contact</a></li></ul></div>
        <div><h4>Resources</h4><ul>
          <li><a href="blog.html">Blog</a></li><li><a href="blog-post.html">Automation playbook</a></li>
          <li><a href="index.html#results">Case studies</a></li><li><a href="contact.html#faq">FAQ</a></li></ul></div>
        <div><h4>Socials</h4><ul>
          <li><a href="#" style="display:inline-flex;gap:8px;align-items:center"><span style="width:14px;display:inline-block">${ICONS.xlogo}</span>Twitter / X</a></li>
          <li><a href="#" style="display:inline-flex;gap:8px;align-items:center"><span style="width:14px;display:inline-block">${ICONS.linkedin}</span>LinkedIn</a></li>
          <li><a href="#" style="display:inline-flex;gap:8px;align-items:center"><span style="width:14px;display:inline-block">${ICONS.youtube}</span>YouTube</a></li></ul></div>
      </div>
      <div class="footer-bottom"><span>© ${new Date().getFullYear()} Ashetag. All rights reserved.</span><span style="display:flex;gap:20px"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a></span></div>
    </div>
    <div class="footer-word" aria-hidden="true">ashetag</div>
  </footer>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>`;

  const hSlot = document.querySelector("[data-include='header']");
  const fSlot = document.querySelector("[data-include='footer']");
  const isSitePage = !!hSlot;
  if (hSlot) hSlot.outerHTML = header;
  if (fSlot) fSlot.outerHTML = footer;

  /* ---------- WhatsApp: floating button + pre-filled message ---------- */
  const WA_NUMBER = "60179812010";
  const pageNames = { home: "Home", product: "Product", about: "About us", blog: "Blog", contact: "Contact" };
  const pageNote = pageNames[page] ? `\n\n(Sent from the ${pageNames[page]} page)` : "";
  const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text + pageNote)}`;
  const openWA = (text) => {
    const url = waLink(text);
    const w = window.open(url, "_blank", "noopener");
    if (!w) window.location.href = url;
    return url;
  };
  const waText = "Hi Ashetag! 👋 I'd like to book a free AI audit for my business. Could you tell me more?";
  const WA_URL = waLink(waText);
  document.querySelectorAll("[data-wa-link]").forEach((a) => {
    a.href = waLink(a.dataset.waText || waText); a.target = "_blank"; a.rel = "noopener";
  });

  if (isSitePage) {
    const wa = document.createElement("div");
    wa.innerHTML = `
      <div class="wa-teaser" id="waTeaser" role="dialog" aria-label="Chat with Ashetag on WhatsApp">
        <a href="${WA_URL}" target="_blank" rel="noopener" class="wa-teaser__body">
          <span class="wa-teaser__av">${ICONS.logo}</span>
          <span>
            <span class="wa-teaser__name">Ashetag <i></i><em>Online</em></span>
            <span class="wa-teaser__msg">Hi there 👋 Curious what AI could automate for your business? Chat with us on WhatsApp.</span>
          </span>
        </a>
        <button class="wa-teaser__x" aria-label="Dismiss">${ICONS.x}</button>
      </div>
      <a class="wa-float" id="waFloat" href="${WA_URL}" target="_blank" rel="noopener" aria-label="Chat with Ashetag on WhatsApp">
        <span class="wa-float__ico">${ICONS.whatsapp}</span>
        <span class="wa-float__label" aria-hidden="true">WhatsApp us</span>
      </a>`;
    document.body.append(...wa.children);
    const fl = document.getElementById("waFloat");
    const teaser = document.getElementById("waTeaser");
    const seen = () => { try { return sessionStorage.getItem("ashetag_wa_seen") === "1"; } catch (_) { return false; } };
    const markSeen = () => { try { sessionStorage.setItem("ashetag_wa_seen", "1"); } catch (_) {} };
    const hideTeaser = () => { teaser.classList.remove("is-on"); markSeen(); };
    setTimeout(() => fl.classList.add("is-in"), 900);
    if (!seen()) setTimeout(() => { if (!seen() && !document.body.classList.contains("menu-locked")) teaser.classList.add("is-on"); }, 6000);
    teaser.querySelector(".wa-teaser__x").addEventListener("click", hideTeaser);
    teaser.querySelector(".wa-teaser__body").addEventListener("click", hideTeaser);
    fl.addEventListener("click", hideTeaser);
  }

  /* ---------- Fill placeholders ---------- */
  document.querySelectorAll("[data-icon]").forEach((el) => { el.innerHTML = ICONS[el.dataset.icon] || ""; });
  document.querySelectorAll("[data-doodle]").forEach((el) => {
    el.innerHTML = DOODLES[el.dataset.doodle] || "";
    const svg = el.querySelector("svg");
    if (svg && el.hasAttribute("data-draw")) svg.classList.add("draw");
  });
  /* Portraits: show the illustrated fallback, then swap in a real photo from
     assets/images/people/<data-avatar>.jpg as soon as that file exists. */
  document.querySelectorAll("[data-avatar]").forEach((el) => {
    const seed = el.dataset.avatar;
    el.innerHTML = avatar(seed, el.dataset.bg);
    const img = new Image();
    img.alt = "";
    img.decoding = "async";
    img.className = "photo";
    img.onload = () => { el.innerHTML = ""; el.appendChild(img); el.classList.add("has-photo"); };
    img.src = `assets/images/people/${seed}.jpg`;
  });

  /* ---------- Toast ---------- */
  const toastEl = document.getElementById("toast");
  let toastT;
  window.toast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("is-on"), 2800);
  };

  /* ---------- Nav: scroll state, dropdowns, mobile ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav && nav.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  document.querySelectorAll(".nav__item.has-dd").forEach((item) => {
    let t;
    item.addEventListener("mouseenter", () => { clearTimeout(t); item.classList.add("is-open"); });
    item.addEventListener("mouseleave", () => { t = setTimeout(() => item.classList.remove("is-open"), 120); });
    item.addEventListener("focusin", () => item.classList.add("is-open"));
    item.addEventListener("focusout", (e) => { if (!item.contains(e.relatedTarget)) item.classList.remove("is-open"); });
  });
  const burger = document.querySelector(".nav__burger");
  const mm = document.getElementById("mobileMenu");
  if (burger) burger.addEventListener("click", () => {
    const open = !nav.classList.contains("menu-open");
    nav.classList.toggle("menu-open", open); mm.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-locked", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        e.target.querySelectorAll(".doodle.draw").forEach((d) => d.classList.add("is-in"));
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal, [data-draw], .ring-wrap").forEach((el) => io.observe(el));

  /* ---------- Count-up numbers ---------- */
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target; cio.unobserve(el);
      const target = parseFloat(el.dataset.count); const dec = (el.dataset.count.split(".")[1] || "").length;
      const pre = el.dataset.prefix || ""; const suf = el.dataset.suffix || "";
      const start = performance.now(); const dur = 1600;
      const step = (now) => {
        const p = Math.min(1, (now - start) / dur); const v = target * (1 - Math.pow(1 - p, 4));
        el.textContent = pre + v.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));

  /* ---------- Hero live feed ---------- */
  const feed = document.querySelector("[data-feed]");
  if (feed) {
    const items = [
      { n: "ElevenLabs voice agent", p: "Dental clinic · Patient call answered", t: "Appointment booked", bg: "#ffd7f0", c: "#e8400d", i: "calendar" },
      { n: "n8n invoice flow", p: "Wholesale distributor · Synced to Xero", t: "Invoice processed", bg: "#b7efb2", c: "#2bc46a", i: "db" },
      { n: "Webflow website", p: "Design studio · 98 Lighthouse score", t: "Site deployed", bg: "#e2ddfd", c: "#7b61ff", i: "globe" },
      { n: "Claude lead qualifier", p: "Real estate agency · Scored & routed", t: "Lead qualified", bg: "#ffef99", c: "#e8a10d", i: "users" },
      { n: "OpenAI intake summary", p: "Law firm · Summary sent to Slack", t: "Case summarised", bg: "#cdeeff", c: "#1e88e5", i: "chat" },
      { n: "Make cart recovery", p: "Online store · Follow-up sent", t: "Revenue recovered", bg: "#ffe1c7", c: "#e8400d", i: "cart" },
      { n: "Gemini support agent", p: "Clinic network · Ticket resolved", t: "Ticket resolved", bg: "#b7efb2", c: "#2bc46a", i: "bot" }
    ];
    const row = (it) => `<div class="app-row"><span class="cb"></span><span class="av" style="background:${it.bg}">${ICONS[it.i]}<i class="mini" style="background:${it.c}"></i></span><span class="meta"><b>${it.n}</b><span>${it.p}</span></span><span class="tag">${it.t}<i style="background:${it.c}"></i></span></div>`;
    let idx = 4;
    feed.innerHTML = items.slice(0, 4).map(row).join("");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) setInterval(() => {
      if (document.hidden) return;
      const it = items[idx % items.length]; idx++;
      const tmp = document.createElement("div"); tmp.innerHTML = row(it);
      const el = tmp.firstElementChild; el.classList.add("enter");
      feed.prepend(el);
      const rows = feed.querySelectorAll(".app-row");
      if (rows.length > 5) rows[rows.length - 1].remove();
    }, 2600);
  }

  /* ---------- Tabs with autoplay progress ---------- */
  document.querySelectorAll("[data-tabs]").forEach((wrap) => {
    const btns = [...wrap.querySelectorAll(".tab-btn")];
    const panels = [...wrap.querySelectorAll(".tab-panel")];
    const dur = parseInt(wrap.dataset.tabs || "6000", 10);
    wrap.style.setProperty("--dur", dur + "ms");
    let i = 0, timer, visible = false;
    const go = (n, user) => {
      i = (n + btns.length) % btns.length;
      btns.forEach((b, k) => { b.setAttribute("aria-selected", String(k === i)); const pr = b.querySelector(".prog"); if (pr) { pr.style.animation = "none"; void pr.offsetWidth; pr.style.animation = ""; } });
      panels.forEach((p, k) => p.classList.toggle("is-active", k === i));
      clearTimeout(timer);
      if (visible) timer = setTimeout(() => go(i + 1), dur);
      if (user) wrap.classList.remove("tabs-paused");
    };
    btns.forEach((b, k) => b.addEventListener("click", () => go(k, true)));
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting; wrap.classList.toggle("tabs-paused", !visible);
      clearTimeout(timer); if (visible) timer = setTimeout(() => go(i + 1), dur);
    }, { threshold: 0.3 }).observe(wrap);
    go(0);
  });

  /* ---------- Floating orb section switcher ---------- */
  const orbs = document.querySelector(".orbs");
  if (orbs) {
    const links = [...orbs.querySelectorAll(".orb")];
    const secs = links.map((l) => document.querySelector(l.getAttribute("href")));
    const zone = document.querySelector(orbs.dataset.zone || "main");
    const update = () => {
      const zr = zone.getBoundingClientRect();
      const inZone = zr.top < window.innerHeight * 0.5 && zr.bottom > window.innerHeight * 0.6;
      orbs.classList.toggle("is-visible", inZone);
      let active = 0;
      secs.forEach((s, k) => { if (s && s.getBoundingClientRect().top < window.innerHeight * 0.45) active = k; });
      links.forEach((l, k) => l.classList.toggle("is-active", k === active));
    };
    update(); window.addEventListener("scroll", update, { passive: true });
  }

  /* ---------- Sticky sub-nav (product) ---------- */
  const subnav = document.querySelector(".subnav");
  if (subnav) {
    const links = [...subnav.querySelectorAll("a")];
    const secs = links.map((l) => document.querySelector(l.getAttribute("href")));
    const upd = () => {
      let a = -1;
      secs.forEach((s, k) => { if (s && s.getBoundingClientRect().top < 200) a = k; });
      links.forEach((l, k) => l.classList.toggle("is-active", k === a));
    };
    upd(); window.addEventListener("scroll", upd, { passive: true });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-q").forEach((q) => {
    q.addEventListener("click", () => {
      const item = q.closest(".faq-item"); const open = !item.classList.contains("is-open");
      item.parentElement.querySelectorAll(".faq-item.is-open").forEach((o) => { o.classList.remove("is-open"); o.querySelector(".faq-q").setAttribute("aria-expanded", "false"); });
      item.classList.toggle("is-open", open); q.setAttribute("aria-expanded", String(open));
    });
  });

  /* ---------- Manifesto word highlight on scroll ---------- */
  const man = document.querySelector("[data-manifesto]");
  if (man) {
    man.innerHTML = man.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");
    const words = [...man.querySelectorAll(".w")];
    const upd = () => {
      const r = man.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.8 - r.top) / (r.height + window.innerHeight * 0.3)));
      const n = Math.round(p * words.length);
      words.forEach((w, k) => w.classList.toggle("on", k < n));
    };
    upd(); window.addEventListener("scroll", upd, { passive: true });
  }

  /* ---------- Blog filters + search ---------- */
  const filterWrap = document.querySelector("[data-filters]");
  if (filterWrap) {
    const cards = [...document.querySelectorAll("[data-cat]")];
    const search = document.querySelector("[data-search]");
    const empty = document.querySelector("[data-empty]");
    let cat = "all";
    const apply = () => {
      const q = (search && search.value.trim().toLowerCase()) || "";
      let shown = 0;
      cards.forEach((c) => {
        const ok = (cat === "all" || c.dataset.cat === cat) && (!q || c.textContent.toLowerCase().includes(q));
        c.classList.toggle("is-hidden", !ok); if (ok) shown++;
      });
      if (empty) empty.style.display = shown ? "none" : "block";
    };
    filterWrap.querySelectorAll(".filter").forEach((f) => f.addEventListener("click", () => {
      filterWrap.querySelectorAll(".filter").forEach((x) => x.classList.remove("is-active"));
      f.classList.add("is-active"); cat = f.dataset.filter; apply();
    }));
    if (search) search.addEventListener("input", apply);
  }

  /* ---------- Article: progress + TOC ---------- */
  const prog = document.querySelector(".progress");
  const prose = document.querySelector(".prose");
  if (prog && prose) {
    const tocLinks = [...document.querySelectorAll(".toc a")];
    const heads = tocLinks.map((a) => document.querySelector(a.getAttribute("href")));
    const upd = () => {
      const r = prose.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight * 0.6)));
      prog.style.width = (p * 100).toFixed(2) + "%";
      let a = 0; heads.forEach((h, k) => { if (h && h.getBoundingClientRect().top < 140) a = k; });
      tocLinks.forEach((l, k) => l.classList.toggle("is-active", k === a));
    };
    upd(); window.addEventListener("scroll", upd, { passive: true });
  }
  document.querySelectorAll("[data-copy-link]").forEach((b) => b.addEventListener("click", () => {
    const done = () => window.toast("Link copied to clipboard");
    if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, done); else done();
  }));

  document.querySelectorAll("[data-share]").forEach((b) => b.addEventListener("click", () => {
    const u = encodeURIComponent(location.href), t = encodeURIComponent(document.title);
    const url = b.dataset.share === "x" ? `https://x.com/intent/post?url=${u}&text=${t}` : `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
    window.open(url, "_blank", "noopener,width=600,height=560");
  }));

  /* ---------- Quick capture boxes → WhatsApp with what they typed ---------- */
  document.querySelectorAll("[data-capture]").forEach((f) => {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = f.querySelector("input");
      const val = (input && input.value.trim()) || "";
      openWA("Hi Ashetag! 👋 I'd like a free AI audit for my business." + (val ? `\n\nWhat I'd like to automate: ${val}` : ""));
      if (input) input.value = "";
      window.toast("Opening WhatsApp…");
    });
  });

  /* ---------- Contact form → pre-written WhatsApp message ---------- */
  const cform = document.querySelector("[data-contact-form]");
  if (cform) {
    const submitBtn = cform.querySelector("button[type=submit]");
    const submitHTML = submitBtn.innerHTML;
    let lastText = "";
    const buildMessage = () => {
      const v = (n) => (cform.elements[n] && cform.elements[n].value.trim()) || "";
      const interests = [...cform.querySelectorAll("input[name=interest]:checked")].map((c) => c.nextElementSibling.textContent.trim());
      const budget = cform.querySelector("input[name=budget]:checked");
      const lines = [
        "Hi Ashetag! 👋 I'd like to book a free AI audit.",
        "",
        `Name: ${v("name")}`,
        v("company") && `Company: ${v("company")}`,
        `Team size: ${v("size")}`,
        interests.length && `Interested in: ${interests.join(", ")}`,
        budget && `Budget: ${budget.nextElementSibling.textContent.trim()}`,
        "",
        "What's eating up our time:",
        v("message"),
      ];
      return lines.filter((l) => l !== false && l !== 0 && l !== null && l !== undefined).join("\n").replace(/\n{3,}/g, "\n\n");
    };
    const validate = (field) => {
      const wrap = field.closest(".field"); if (!wrap) return true;
      const ok = field.checkValidity(); wrap.classList.toggle("has-error", !ok); return ok;
    };
    cform.querySelectorAll("input, textarea, select").forEach((f) => f.addEventListener("blur", () => { if (f.value) validate(f); }));
    cform.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true; let first;
      cform.querySelectorAll("input[required], textarea[required], select[required]").forEach((f) => { if (!validate(f)) { ok = false; first = first || f; } });
      if (!ok) { first.focus(); return; }
      // Open WhatsApp synchronously inside the submit handler so pop-up blockers allow it.
      lastText = buildMessage();
      openWA(lastText);
      document.querySelector(".form-success").classList.add("is-on");
      document.querySelector(".form-success .doodle")?.classList.add("draw");
      requestAnimationFrame(() => document.querySelector(".form-success .doodle")?.classList.add("is-in"));
    });
    const reopen = document.querySelector("[data-wa-reopen]");
    if (reopen) reopen.addEventListener("click", () => openWA(lastText || buildMessage()));
    const reset = document.querySelector("[data-reset-form]");
    if (reset) reset.addEventListener("click", () => {
      submitBtn.innerHTML = submitHTML;
      document.querySelector(".form-success").classList.remove("is-on");
    });
  }

  /* ---------- Local office clocks ---------- */
  document.querySelectorAll("[data-tz]").forEach((el) => {
    const upd = () => { try { el.textContent = new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit", timeZone: el.dataset.tz }).format(new Date()) + " local time"; } catch (_) {} };
    upd(); setInterval(upd, 30000);
  });

  /* ---------- Subtle parallax on [data-parallax] ---------- */
  const pars = [...document.querySelectorAll("[data-parallax]")];
  if (pars.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const upd = () => pars.forEach((el) => {
      const r = el.getBoundingClientRect(); const s = parseFloat(el.dataset.parallax) || 0.1;
      el.style.transform = `translateY(${((r.top + r.height / 2 - window.innerHeight / 2) * -s).toFixed(1)}px)`;
    });
    upd(); window.addEventListener("scroll", upd, { passive: true });
  }
})();
