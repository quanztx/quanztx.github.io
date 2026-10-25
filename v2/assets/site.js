'use strict';
document.documentElement.classList.add('js-ready');

const navToggle = document.querySelector('.nav-toggle');
const navigation = document.querySelector('.nav-links');
function closeNavigation() {
  navigation.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation');
}
navToggle.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNavigation));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeNavigation(); });

const cards = [...document.querySelectorAll('.project-card')];
const filters = [...document.querySelectorAll('.filter-button')];
const count = document.querySelector('.project-count');
function filterProjects(category) {
  let visible = 0;
  cards.forEach(card => {
    const show = category === 'All' || card.dataset.category === category;
    card.hidden = !show;
    if (show) visible += 1;
  });
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  count.textContent = `${visible} student project${visible === 1 ? '' : 's'}`;
  document.querySelector('.empty-state').hidden = visible > 0;
}
filters.forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));
// A cross-section link must reveal its destination, even when a filter was active.
document.querySelectorAll('a[href^="#project-"]').forEach(link => link.addEventListener('click', () => filterProjects('All')));

const imageDialog = document.querySelector('.image-dialog');
if (typeof imageDialog.showModal === 'function') {
  document.querySelectorAll('.image-preview').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const image = imageDialog.querySelector('.dialog-image');
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    imageDialog.querySelector('.dialog-caption').textContent = link.dataset.caption;
    imageDialog.showModal();
  }));
  imageDialog.querySelector('.dialog-close').addEventListener('click', () => imageDialog.close());
  imageDialog.addEventListener('click', event => { if (event.target === imageDialog) imageDialog.close(); });
}

document.querySelectorAll('.copy-citation').forEach(button => {
  if (!navigator.clipboard?.writeText) return;
  button.hidden = false;
  button.addEventListener('click', async () => {
    const status = button.closest('.paper-content').querySelector('.copy-status');
    try {
      await navigator.clipboard.writeText(document.getElementById(`cite-${button.dataset.citation}`).textContent.trim());
      status.textContent = 'Citation copied.';
    } catch {
      status.textContent = 'Copy unavailable. Please download the BibTeX file.';
    }
  });
});

const toTop = document.querySelector('.back-to-top');
const updateScroll = () => { toTop.hidden = window.scrollY < 900; };
window.addEventListener('scroll', updateScroll, { passive: true });
updateScroll();
