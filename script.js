(() => {
  const toggle = document.getElementById('langToggle');
  const menu = document.getElementById('menuToggle');
  const nav = document.getElementById('navLinks');
  const setOpen = open => { nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', document.documentElement.lang === 'en' ? (open ? 'Close menu' : 'Open menu') : (open ? 'Fechar menu' : 'Abrir menu')); };
  function setLang(lang) {
    lang = lang === 'en' ? 'en' : 'pt';
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-' + lang + ']').forEach(el => { const text = el.getAttribute('data-' + lang); if (el.tagName === 'META') el.setAttribute('content', text); else el.textContent = text; });
    document.querySelectorAll('[data-href-' + lang + ']').forEach(el => el.href = el.getAttribute('data-href-' + lang));
    document.querySelectorAll('[data-alt-' + lang + ']').forEach(el => el.setAttribute('alt', el.getAttribute('data-alt-' + lang)));
    toggle.textContent = lang === 'pt' ? 'EN' : 'PT';
    toggle.setAttribute('aria-label', lang === 'pt' ? 'Switch to English' : 'Mudar para português');
    setOpen(false);
    try { localStorage.setItem('lang', lang); } catch {}
  }
  let saved = 'pt'; try { saved = localStorage.getItem('lang') || 'pt'; } catch {}
  setLang(saved);
  toggle.addEventListener('click', () => setLang(document.documentElement.lang === 'pt' ? 'en' : 'pt'));
  menu.addEventListener('click', () => setOpen(menu.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { setOpen(false); menu.focus(); } });
  window.addEventListener('resize', () => { if (window.innerWidth > 760) setOpen(false); });
})();