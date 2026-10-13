import { articles, categories, searchArticles } from './data.js';

const findArticle = id => articles.find(article => article.id === id);
const searchDialog = document.querySelector('#search-dialog');
const articleDialog = document.querySelector('#article-dialog');
const searchInput = document.querySelector('#search-input');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let articleSearchContext = null;

function imageMarkup(article, { eager = false, badge = false } = {}) {
  return `<div class="image-wrap">
    <img src="${article.image}" alt="${article.alt}" loading="${eager ? 'eager' : 'lazy'}" ${eager ? 'fetchpriority="high"' : ''} width="800" height="500">
    ${badge ? '<span class="image-tag">LA PLATA EN IMÁGENES</span>' : ''}
    <span class="image-arrow" aria-hidden="true">↗</span>
  </div>`;
}

function metaMarkup(article) {
  return `<p class="story-meta"><b>INFOLAPLATA</b><span class="dash" aria-hidden="true"></span>${article.reading}</p>`;
}

const lead = findArticle('diagonales');
document.querySelector('#lead-story').innerHTML = `
  <button class="story-link" data-article="${lead.id}">
    ${imageMarkup(lead, { eager: true, badge: true })}
    <p class="photo-credit">${lead.credit}</p>
    <p class="story-kicker">${lead.tag}<span aria-hidden="true"> / </span>ESPECIAL DEMO</p>
    <h2>${lead.title}</h2>
    <p class="excerpt">${lead.excerpt}</p>
  </button>${metaMarkup(lead)}`;

document.querySelector('#secondary-stories').innerHTML = ['plaza', 'corea'].map(id => {
  const article = findArticle(id);
  return `<article class="secondary-story"><button class="story-link" data-article="${id}">
    ${imageMarkup(article, { eager: true })}
    <p class="story-kicker">${article.tag}</p><h3>${article.title}</h3>
  </button>${metaMarkup(article)}</article>`;
}).join('');

document.querySelector('#latest-list').innerHTML = ['plaza', 'mercado', 'bosque', 'teatro'].map((id, index) => {
  const article = findArticle(id);
  return `<li><span class="latest-number" aria-hidden="true">0${index + 1}</span>
    <button data-article="${id}"><span class="story-kicker">${article.category}</span><h3>${article.title}</h3></button></li>`;
}).join('');

const culture = findArticle('teatro');
document.querySelector('#culture-feature').innerHTML = `<button class="story-link" data-article="${culture.id}">
  ${imageMarkup(culture)}
  <div class="culture-copy"><p class="story-kicker">CULTURA <span aria-hidden="true">/</span> ${culture.tag}</p>
    <h3>${culture.title}</h3><p class="excerpt">${culture.excerpt}</p>
    <span class="text-link">Descubrir la historia <span aria-hidden="true">↗</span></span>
  </div></button>`;

function renderCategory(category = 'Todas') {
  document.querySelector('#category-filters').innerHTML = categories.map(item =>
    `<button class="filter" data-filter="${item}" aria-pressed="${item === category}">${item}</button>`
  ).join('');
  const visible = category === 'Todas'
    ? ['mercado', 'bosque', 'deporte'].map(findArticle)
    : searchArticles(articles, '', category);
  document.querySelector('#article-grid').innerHTML = visible.map(article => `
    <article class="news-card"><button class="story-link" data-article="${article.id}">
      ${imageMarkup(article)}<p class="story-kicker">${article.tag}</p><h3>${article.title}</h3>
      <p class="excerpt">${article.excerpt}</p></button>${metaMarkup(article)}</article>`).join('');
  document.querySelector('#filter-status').textContent = `${visible.length} noticias. Sección: ${category}.`;
  document.querySelectorAll('[data-nav]').forEach(link => {
    const active = link.dataset.nav === (category === 'Todas' ? 'Inicio' : category);
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}
renderCategory();

function closeMenu({ restoreFocus = false } = {}) {
  navigation.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
  if (restoreFocus) menuToggle.focus();
}

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});

function openDialog(dialog) {
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}

for (const dialog of [searchDialog, articleDialog]) {
  dialog.addEventListener('close', () => {
    if (!searchDialog.open && !articleDialog.open) document.body.style.overflow = '';
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
}

articleDialog.addEventListener('close', () => {
  if (articleSearchContext) {
    const id = articleSearchContext;
    articleSearchContext = null;
    openDialog(searchDialog);
    document.querySelector(`#search-results [data-article="${id}"]`)?.focus();
  }
});

function renderSearch() {
  const results = searchArticles(articles, searchInput.value);
  document.querySelector('#search-status').textContent = searchInput.value.trim()
    ? `${results.length} ${results.length === 1 ? 'noticia encontrada' : 'noticias encontradas'}`
    : 'Algunas historias para empezar';
  document.querySelector('#search-results').innerHTML = results.length
    ? results.map(article => `<button class="search-result" data-article="${article.id}">
        <img src="${article.image}" alt="" width="75" height="60">
        <div><span class="story-kicker">${article.category}</span><h3>${article.title}</h3></div><span aria-hidden="true">↗</span>
      </button>`).join('')
    : '<div class="empty-state"><h3>No encontramos esa historia.</h3><p>Prueba con otro tema, como “ciudad”, “música” o “cultura”.</p></div>';
}

function openSearch(query = '') {
  searchInput.value = query;
  renderSearch();
  openDialog(searchDialog);
  searchInput.focus();
}
searchInput.addEventListener('input', renderSearch);

function openArticle(id) {
  const article = findArticle(id);
  if (!article) return;
  document.querySelector('#article-content').innerHTML = `
    <img src="${article.image}" alt="${article.alt}" width="800" height="500">
    <p class="story-kicker">${article.category}</p><h2 id="article-title">${article.title}</h2>
    <p class="article-excerpt">${article.excerpt}</p>
    <p class="article-note">${article.note || 'Resumen adaptado para esta propuesta visual. Para consultar la noticia completa, sus fechas y detalles, visita la publicación original de INFOLAPLATA.'}</p>
    <a class="source-link" href="${article.source}" target="_blank" rel="noopener noreferrer">${article.sourceLabel || 'Leer la noticia original'} <span aria-hidden="true">↗</span></a>`;
  if (searchDialog.open) {
    articleSearchContext = id;
    searchDialog.close();
  }
  openDialog(articleDialog);
  articleDialog.scrollTop = 0;
}

document.addEventListener('click', event => {
  const trigger = event.target.closest('button, a');
  if (!trigger) return;
  if (trigger.hasAttribute('data-open-search')) openSearch();
  if (trigger.dataset.close) document.getElementById(trigger.dataset.close).close();
  if (trigger.dataset.article) openArticle(trigger.dataset.article);
  if (trigger.dataset.topic) openSearch(trigger.dataset.topic);
  if (trigger.dataset.filter) {
    const category = trigger.dataset.filter;
    renderCategory(category);
    // Keep keyboard focus after replacing the filter controls.
    [...document.querySelectorAll('[data-filter]')].find(button => button.dataset.filter === category).focus();
  }
  if (trigger.dataset.nav) {
    renderCategory(trigger.dataset.nav === 'Inicio' ? 'Todas' : trigger.dataset.nav);
    const wasOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    closeMenu();
    if (wasOpen) {
      const target = document.querySelector(trigger.dataset.nav === 'Inicio' ? '#front-title' : '#explore-title');
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  }
  if (trigger.dataset.categoryLink) {
    renderCategory(trigger.dataset.categoryLink);
    document.querySelector('#explore').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    document.querySelector('[data-filter][aria-pressed="true"]').focus({ preventScroll: true });
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu({ restoreFocus: true });
  const editing = event.target.matches('input, textarea, select') || event.target.isContentEditable;
  if (event.key === '/' && !editing && !searchDialog.open && !articleDialog.open) {
    event.preventDefault();
    openSearch();
  }
});

window.matchMedia('(min-width: 581px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

document.querySelector('#newsletter-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  document.querySelector('#newsletter-status').textContent = '¡Así se vería tu confirmación! Es una demo: no se envió ni guardó tu correo.';
  form.reset();
});

const topButton = document.querySelector('.back-to-top');
const progress = document.querySelector('.reading-progress');
function updateScrollState() {
  topButton.hidden = window.scrollY < 450;
  const available = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${available > 0 ? window.scrollY / available : 0})`;
}
window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();
topButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  document.querySelector('.wordmark').focus({ preventScroll: true });
});

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.remove('pending-reveal');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(section => {
    if (section.getBoundingClientRect().top > window.innerHeight) section.classList.add('pending-reveal');
    observer.observe(section);
  });
}
