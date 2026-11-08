/* Personal reading journal. Data stays in this browser and is shared by list/detail views. */
const JOURNAL_KEY = 'library.book-list.journal.v1';
let journal = {};
let journalWritable = true;
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function bookId(book) {
  return (book.title + '--' + book.author).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/g, '');
}
function readJournal() {
  try {
    const saved = JSON.parse(localStorage.getItem(JOURNAL_KEY) || '{}');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) throw new Error('Invalid journal');
    journal = saved;
    journalWritable = true;
  } catch {
    journalWritable = false;
    showJournalMessage('Your reading journal could not be loaded. Changes will only last for this visit. Allow browser storage to save your ratings and notes.');
  }
}
function reading(book) {
  const entry = journal[bookId(book)] || {};
  return {
    read: entry.read === true,
    rating: Number.isInteger(entry.rating) && entry.rating >= 1 && entry.rating <= 5 ? entry.rating : 0,
    notes: typeof entry.notes === 'string' ? entry.notes : '',
    priority: ['high', 'low'].includes(entry.priority) ? entry.priority : ''
  };
}
function showJournalMessage(message) {
  const banner = document.getElementById('journalMessage');
  if (banner) { banner.textContent = message; banner.hidden = false; }
}
function saveReading(book, updates) {
  journal[bookId(book)] = { ...reading(book), ...updates };
  try {
    if (!journalWritable) throw new Error('Storage unavailable');
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal));
    return true;
  } catch {
    showJournalMessage('Changes are kept for this visit, but could not be saved in this browser. Keep this page open to retain your notes.');
    return false;
  }
}
function readingControls(book) {
  const entry = reading(book);
  const id = bookId(book);
  return `<div class="reading-controls" data-reading="${id}">
    <button class="read-button" type="button" data-read="${id}" aria-pressed="${entry.read}">${entry.read ? 'Read ✓ · Mark as unread' : 'Mark as read'}</button>
    ${entry.read ? `<div class="rating-panel">
      <p class="rating-caption">${entry.rating ? `Your rating: ${entry.rating}/5` : 'How was it? Choose 1–5 stars.'}</p>
      <div class="stars" role="group" aria-label="Your rating for ${escapeHtml(book.title)}">
        ${[1,2,3,4,5].map(n => `<button type="button" class="star ${n <= entry.rating ? 'filled' : ''}" data-rate="${id}" data-value="${n}" aria-label="Rate ${n} ${n === 1 ? 'star' : 'stars'}" aria-pressed="${entry.rating === n}"><span aria-hidden="true">${n <= entry.rating ? '★' : '☆'}</span></button>`).join('')}
      </div>
      ${entry.rating ? `<button type="button" class="text-button" data-clear-rating="${id}">Clear rating</button>` : ''}
    </div>` : ''}
    <label class="priority-label" data-level="${entry.priority}">Read priority
      <select data-priority="${id}" aria-label="Read priority for ${escapeHtml(book.title)}">
        <option value="" ${!entry.priority ? 'selected' : ''}>Not set</option>
        <option value="high" ${entry.priority === 'high' ? 'selected' : ''}>High priority</option>
        <option value="low" ${entry.priority === 'low' ? 'selected' : ''}>Low priority</option>
      </select>
    </label>
  </div>`;
}
function updateReadingControls(book, focusSelector) {
  document.querySelectorAll(`[data-reading="${bookId(book)}"]`).forEach(el => {
    el.outerHTML = readingControls(book);
  });
  if (focusSelector) {
    const scope = document.getElementById('bookDetail').hidden ? document.getElementById('bookGrid') : document.getElementById('bookDetail');
    scope.querySelector(focusSelector)?.focus();
  }
}
function detailRoute() {
  const detail = document.getElementById('bookDetail');
  const id = location.hash.startsWith('#book=') ? location.hash.slice(6) : '';
  const book = books.find(item => bookId(item) === id);
  const isDetail = Boolean(id);
  document.querySelectorAll('main > .hero, main > .toolbar, main > .content').forEach(el => { el.hidden = isDetail; });
  detail.hidden = !isDetail;
  document.title = book ? `${book.title} | Book Tracker and List` : 'Book Tracker and List';
  if (!isDetail) return;
  if (!book) {
    detail.innerHTML = '<a class="back" href="#">← Back to Book Tracker and List</a><h1 class="detail-title" tabindex="-1">Book not found</h1><p>Return to your list to choose a book.</p>';
  } else {
    const entry = reading(book);
    detail.innerHTML = `<a class="back" href="#">← Back to Book Tracker and List</a>
      <div class="detail-layout">
        <aside class="detail-sidebar">
          <div class="cover-wrap detail-cover"><img id="detailCover" alt="" /></div>
          <div class="detail-reading">${readingControls(book)}</div>
          <p class="storage-note">Your read status, ratings, and notes are saved in this browser on this device.</p>
        </aside>
        <div class="detail-body">
          <p class="eyebrow">Your reading journal</p>
          <h1 class="detail-title" tabindex="-1">${escapeHtml(book.title)}</h1>
          <p class="detail-author">by ${escapeHtml(book.author)}</p>
          <section class="detail-panel" aria-labelledby="synopsisTitle">
            <h2 id="synopsisTitle">About the book</h2>
            <p class="synopsis">${escapeHtml(book.plot)}</p>
            <h3>The world and its magic</h3>
            <p>${escapeHtml(book.setting)} ${escapeHtml(book.magic)}</p>
            <h3>What to expect</h3>
            <p>${escapeHtml(book.romance)}</p>
            <div class="meta-row">${(book.genres || []).map(genre => `<span class="tag genre-tag">${escapeHtml(genre)}</span>`).join('')}${book.tropes.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
            <h3>Series and reading order</h3><p>${escapeHtml(book.series)}</p>
            <div class="source-list">${book.sources.map(s => `<a href="${escapeHtml(s.url)}" target="_blank" rel="noreferrer">${escapeHtml(s.label)} ↗</a>`).join('')}</div>
          </section>
          ${seriesDetails(book)}
          <section class="detail-panel" aria-labelledby="notesTitle">
            <h2 id="notesTitle">Your notes</h2>
            <p class="storage-note">Favorite moments, quotes, questions, or thoughts for later. Notes save as you type.</p>
            <label class="notes-label" for="bookNotes">Notes on ${escapeHtml(book.title)}</label>
            <textarea id="bookNotes" rows="8" placeholder="What would you like to remember about this book?"></textarea>
            <p id="notesStatus" class="save-status" role="status">${entry.notes ? 'Saved notes loaded.' : 'No notes yet.'}</p>
          </section>
        </div>
      </div>`;
    const notes = document.getElementById('bookNotes');
    notes.value = entry.notes;
    notes.addEventListener('input', () => {
      const saved = saveReading(book, { notes: notes.value });
      document.getElementById('notesStatus').textContent = saved ? 'Notes saved.' : 'Notes kept for this visit only — browser storage is unavailable.';
    });
    findCover(book, document.getElementById('detailCover'));
  }
  detail.querySelector('h1').focus({ preventScroll: true });
  window.scrollTo(0, 0);
}
function initJournal() {
  readJournal();
  renderCards();
  detailRoute();
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-read], [data-rate], [data-clear-rating]');
    if (!button) return;
    const id = button.dataset.read || button.dataset.rate || button.dataset.clearRating;
    const book = books.find(item => bookId(item) === id);
    if (!book) return;
    const entry = reading(book);
    if (button.hasAttribute('data-read')) {
      const nowRead = !entry.read;
      saveReading(book, { read: nowRead, rating: nowRead ? entry.rating : 0 });
      updateReadingControls(book, nowRead ? `[data-rate="${id}"]` : `[data-read="${id}"]`);
    } else if (button.hasAttribute('data-rate')) {
      saveReading(book, { read: true, rating: Number(button.dataset.value) });
      updateReadingControls(book, `[data-rate="${id}"][data-value="${button.dataset.value}"]`);
    } else {
      saveReading(book, { rating: 0 });
      updateReadingControls(book, `[data-rate="${id}"]`);
    }
  });
  document.addEventListener('change', event => {
    const select = event.target.closest('[data-priority]');
    if (!select) return;
    const book = books.find(item => bookId(item) === select.dataset.priority);
    if (!book) return;
    saveReading(book, { priority: select.value });
    updateReadingControls(book);
    if (document.getElementById('bookDetail').hidden) renderCards();
    const scope = document.getElementById('bookDetail').hidden ? grid : document.getElementById('bookDetail');
    scope.querySelector(`[data-priority="${bookId(book)}"]`)?.focus();
  });
  window.addEventListener('hashchange', () => {
    detailRoute();
    if (!location.hash.startsWith('#book=')) renderCards();
  });
  window.addEventListener('storage', event => {
    if (event.key !== JOURNAL_KEY && event.key !== null) return;
    readJournal();
    renderCards();
    books.forEach(book => updateReadingControls(book));
    // Do not replace a note draft that is currently being edited in this tab.
    const notes = document.getElementById('bookNotes');
    const book = books.find(item => '#book=' + bookId(item) === location.hash);
    if (notes && book && document.activeElement !== notes) {
      notes.value = reading(book).notes;
      document.getElementById('notesStatus').textContent = 'Notes updated from browser storage.';
    }
  });
}
function seriesDetails(book) {
  const entries = book.seriesBooks || [];
  if (!entries.length) {
    return `<section class="detail-panel" aria-labelledby="seriesTitle"><h2 id="seriesTitle">Series guide</h2>${characterFocus(book)}<p>${escapeHtml(book.seriesNote || book.series)}</p></section>`;
  }
  const normalize = value => value.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `<section class="detail-panel" aria-labelledby="seriesTitle">
    <p class="eyebrow">Series guide · Checked November 8, 2026</p>
    <h2 id="seriesTitle">${escapeHtml(book.seriesName || 'Books in this series')}</h2>
    ${characterFocus(book)}
    <p>${escapeHtml(book.seriesNote || 'Read in the order below. Companion stories are labeled separately.')}</p>
    <p class="storage-note">Later-book descriptions may reveal the setup of earlier books.</p>
    <ol class="series-list">${entries.map((entry, index) => {
      const tracked = books.find(candidate => normalize(candidate.title) === normalize(entry.title) && candidate.author === book.author);
      const current = tracked && bookId(tracked) === bookId(book);
      const title = tracked && !current ? `<a href="#book=${bookId(tracked)}">${escapeHtml(entry.title)}</a>` : escapeHtml(entry.title);
      return `<li class="series-entry${current ? ' current-book' : ''}">
        <div class="series-entry-heading"><h3>${title}</h3>${current ? '<span class="tag">This book</span>' : ''}</div>
        <p class="series-kind">${escapeHtml(entry.kind || `Book ${index + 1}`)}</p>
        <p>${escapeHtml(entry.synopsis)}</p>
        ${entry.url ? `<a class="series-source" href="${escapeHtml(entry.url)}" target="_blank" rel="noreferrer">Book details ↗</a>` : ''}
      </li>`;
    }).join('')}</ol>
  </section>`;
}
function seriesFocusLabel(book) {
  const labels = {
    'same characters': 'Same main characters',
    'different leads': 'Different leads · same world',
    'ensemble': 'Ensemble cast',
    'mixed / linked stories': 'Mixed / linked stories',
    'standalone': 'Standalone',
    'not yet established': 'Series focus not yet established'
  };
  return labels[book.seriesFocus] || book.seriesFocus || 'Series focus to confirm';
}
function characterFocus(book) {
  return `<div class="character-focus"><h3>${escapeHtml(seriesFocusLabel(book))}</h3><p>${escapeHtml(book.seriesFocusNote || '')}</p></div>`;
}
