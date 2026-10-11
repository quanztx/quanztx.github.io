(() => {
  const toggle = document.querySelector('.theme-toggle');
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let saved = null;
  try { saved = localStorage.getItem('academic-theme'); } catch (_) {}
  const apply = (dark) => {
    root.dataset.theme = dark ? 'dark' : 'light';
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(dark));
      toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      toggle.textContent = dark ? 'Light' : 'Dark';
    }
  };
  apply(saved ? saved === 'dark' : system.matches);
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      saved = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('academic-theme', saved); } catch (_) {}
      apply(saved === 'dark');
    });
  }
  system.addEventListener('change', (event) => { if (!saved) apply(event.matches); });
  document.querySelectorAll('.copy-cite').forEach((button) => {
    button.hidden = false;
    button.addEventListener('click', async () => {
      const text = button.closest('.citation, .paper-citation').querySelector('pre').textContent;
      const status = button.parentElement.querySelector('[role="status"]');
      try {
        await navigator.clipboard.writeText(text);
        status.textContent = 'Citation copied.';
      } catch (_) {
        status.textContent = 'Please select and copy the citation text, or download the BibTeX file.';
      }
    });
  });
})();
